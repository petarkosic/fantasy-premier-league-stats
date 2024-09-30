from flask import Flask, jsonify, request
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score
import csv
import requests

app = Flask(__name__)

def load_data(player_data_file, history_data_file):
    player_data = pd.read_csv(player_data_file)
    history_data = pd.read_csv(history_data_file)
    return player_data, history_data

def preprocess_and_train(player_data, history_data):
    avg_stats = calculate_average_stats(history_data)
    merged_data = pd.merge(player_data, avg_stats, on='id', suffixes=('', '_avg'))
    
    features = [
        'minutes_avg', 'goals_scored_avg', 'assists_avg', 'clean_sheets_avg',
        'goals_conceded_avg', 'own_goals_avg', 'penalties_saved_avg',
        'penalties_missed_avg', 'bonus_avg', 'bps_avg', 'influence_avg', 
        'creativity_avg', 'threat_avg', 'expected_goals_avg', 'expected_assists_avg',
        'expected_goal_involvements_avg', 'form', 'points_per_game', 
        'chance_of_playing_next_round', 
    ]
    
    X = merged_data[features]
    
    y_minutes = (merged_data['minutes_avg'] >= 60).astype(int) * 2 + (merged_data['minutes_avg'] < 60).astype(int)
    y_goals = merged_data['goals_scored_avg']
    y_assists = merged_data['assists_avg'] * 3
    y_clean_sheets = merged_data['clean_sheets_avg']
    y_bonus = merged_data['bonus_avg']
    
    models = []
    scalers = []
    for y in [y_minutes, y_goals, y_assists, y_clean_sheets, y_bonus]:
        model, scaler = train_model(X, y)
        models.append(model)
        scalers.append(scaler)
    
    return models, scalers, merged_data

def calculate_average_stats(history_data, num_weeks=5):
    recent_history = history_data.sort_values(['id', 'round']).groupby('id').tail(num_weeks)
    avg_stats = recent_history.groupby('id').agg({
        'minutes': 'mean',
        'goals_scored': 'mean',
        'assists': 'mean',
        'clean_sheets': 'mean',
        'goals_conceded': 'mean',
        'own_goals': 'mean',
        'penalties_saved': 'mean',
        'penalties_missed': 'mean',
        'bonus': 'mean',
        'bps': 'mean',
        'influence': 'mean',
        'creativity': 'mean',
        'threat': 'mean',
        'expected_goals': 'mean',
        'expected_assists': 'mean',
        'expected_goal_involvements': 'mean',
    }).reset_index()
    return avg_stats

def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Train R2 Score: {train_score:.4f}, Test R2 Score: {test_score:.4f}")
    
    return model, scaler

def predict_next_week(models, scalers, X, merged_data):
    predictions = []
    for model, scaler in zip(models, scalers):
        X_scaled = scaler.transform(X)
        predictions.append(model.predict(X_scaled))
    
    results = pd.DataFrame({
        'id': merged_data['id'],
        'name': merged_data['name'],
        'minutes': predictions[0],
        'goals': predictions[1],
        'assists': predictions[2],
        'clean_sheets': predictions[3],
        'bonus': predictions[4],
    })
    
    results['total_predicted_points'] = results['minutes'] + results['goals'] + results['assists'] + \
                                        results['clean_sheets'] + results['bonus']

    return results.sort_values('total_predicted_points', ascending=False)

@app.route('/predict', methods=['GET'])
def predict_next_week_route():
    try:
        player_data, history_data = load_data('player-data.csv', 'history-data.csv')
        models, scalers, merged_data = preprocess_and_train(player_data, history_data)
        
        X = merged_data[['minutes_avg', 'goals_scored_avg', 'assists_avg', 'clean_sheets_avg',
                         'goals_conceded_avg', 'own_goals_avg', 'penalties_saved_avg',
                         'penalties_missed_avg', 'bonus_avg', 'bps_avg', 'influence_avg', 
                         'creativity_avg', 'threat_avg', 'expected_goals_avg', 'expected_assists_avg',
                         'expected_goal_involvements_avg', 'form', 'points_per_game', 
                         'chance_of_playing_next_round']]
        
        predictions = predict_next_week(models, scalers, X, merged_data)
        
        top_10 = predictions.head(20).to_dict(orient='records')
        
        return jsonify({'top_predicted_players': top_10})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)