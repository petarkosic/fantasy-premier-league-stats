from flask import Flask, jsonify, request
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score
from flask_cors import CORS
import joblib
import os
from datetime import datetime
from scraper import fetch_fpl_data

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'fpl_model.joblib'
SCALER_PATH = 'fpl_scaler.joblib'

def load_data():
    data_dir = os.path.dirname(__file__)
    files = [f for f in os.listdir(data_dir) if os.path.isfile(os.path.join(data_dir, f)) and f.endswith('.csv')]
    if not files:
        return None
    latest_file = max(files, key=lambda f: os.path.getctime(os.path.join(data_dir, f)))
    file_path = os.path.join(data_dir, latest_file)
    try:
        return pd.read_csv(file_path, encoding='utf-8-sig', on_bad_lines='skip')
    except Exception as e:
        print(f"Error reading file {file_path}: {str(e)}")
        return None


def preprocess_and_train(data):
    features = [
        'total_points_x', 'goals_scored_x', 'assists_x', 'clean_sheets_x', 'bonus_x', 'bps_x',
        'expected_goals_x', 'expected_assists_x', 'expected_goal_involvements_x',
        'expected_goals_per_90', 'expected_assists_per_90', 'expected_goal_involvements_per_90',
        'minutes_x', 'influence_x', 'creativity_x', 'threat_x', 'ict_index_x',
        'assists_mean', 'bonus_mean', 'bps_mean', 'clean_sheets_mean', 'creativity_mean',
        'goals_conceded_mean', 'goals_scored_mean', 'ict_index_mean', 'influence_mean',
        'minutes_mean', 'own_goals_mean', 'penalties_missed_mean', 'penalties_saved_mean',
        'red_cards_mean', 'saves_mean', 'selected_mean', 'threat_mean', 'total_points_mean',
        'transfers_balance_mean', 'transfers_in_mean', 'transfers_out_mean', 'value_mean',
        'yellow_cards_mean',
        'points_last_3', 'points_last_5', 'points_last_game', 'points_two_games_ago'
    ]

    X = data[features]
    y = data['y']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Train R2 Score: {train_score:.4f}, Test R2 Score: {test_score:.4f}")
    
    if train_score > 0.9 and test_score < 0.5:
        print("Model is overfitting.")
    elif train_score < 0.5 and test_score < 0.5:
        print("Model is underfitting.")
    
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    
    return model, scaler

def load_model_and_scaler():
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            scaler = joblib.load(SCALER_PATH)
            return model, scaler
        except Exception as e:
            print(f"Error loading model or scaler: {str(e)}")
            return None, None
    else:
        print("Model or scaler files do not exist.")
        return None, None

def predict_next_week(model, scaler, data):
    features = [
        'total_points_x', 'goals_scored_x', 'assists_x', 'clean_sheets_x', 'bonus_x', 'bps_x',
        'expected_goals_x', 'expected_assists_x', 'expected_goal_involvements_x',
        'expected_goals_per_90', 'expected_assists_per_90', 'expected_goal_involvements_per_90',
        'minutes_x', 'influence_x', 'creativity_x', 'threat_x', 'ict_index_x',
        'assists_mean', 'bonus_mean', 'bps_mean', 'clean_sheets_mean', 'creativity_mean',
        'goals_conceded_mean', 'goals_scored_mean', 'ict_index_mean', 'influence_mean',
        'minutes_mean', 'own_goals_mean', 'penalties_missed_mean', 'penalties_saved_mean',
        'red_cards_mean', 'saves_mean', 'selected_mean', 'threat_mean', 'total_points_mean',
        'transfers_balance_mean', 'transfers_in_mean', 'transfers_out_mean', 'value_mean',
        'yellow_cards_mean',
        'points_last_3', 'points_last_5', 'points_last_game', 'points_two_games_ago'
    ]

    X = data[features]
    X_scaled = scaler.transform(X)
    predictions = model.predict(X_scaled)
    
    results = pd.DataFrame({
        'id': data['id'],
        'name': data['first_name'] + ' ' + data['second_name'],
        'predicted_points': predictions
    }).drop_duplicates(subset=['id'], keep='last')
    
    return results.sort_values('predicted_points', ascending=False)

@app.route('/predict', methods=['GET'])
def predict_next_week_route():
    try:
        data = load_data()
        if data is None:
            return jsonify({'error': 'No data available. Please run the scraper first.'}), 400
        
        model, scaler = load_model_and_scaler()
        if model is None or scaler is None:
            model, scaler = preprocess_and_train(data)
        
        predictions = predict_next_week(model, scaler, data)
        
        top_20 = predictions.head(20).to_dict(orient='records')
        
        return jsonify({'top_predicted_players': top_20})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/scrape', methods=['GET'])
def scrape_data():
    data_dir = os.path.dirname(__file__)
    files = [f for f in os.listdir(data_dir) if os.path.isfile(os.path.join(data_dir, f)) and f.endswith('.csv')]
    
    if files:
        return jsonify({'message': 'Data file already exists'}), 200

    try:
        filename = fetch_fpl_data()
        if filename:
            return jsonify({'message': f'Data scraped successfully and saved to {filename}'}), 200
        else:
            return jsonify({'error': 'Failed to scrape data'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)