from flask import Flask, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error, r2_score

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, World!'


@app.route('/predict', methods=['get'])
def predict_points():
    try:
        history_data = pd.read_csv('history-data.csv')
        player_data = pd.read_csv('player-data.csv')

        features = ['id', 'minutes', 'goals_scored', 'assists', 'clean_sheets', 'goals_conceded',
                    'expected_goals', 'expected_assists', 'influence', 'creativity', 'threat']
        target = 'points'

        # Scale the data
        scaler = RobustScaler()
        history_data[features] = scaler.fit_transform(history_data[features])

        X = history_data[features]
        y = history_data[target]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = LinearRegression()
        model.fit(X_train.values, y_train.values)

        y_pred = model.predict(X_test.values)

        y_test_nonzero = y_test[y_test != 0]
        y_pred_nonzero = y_pred[y_test != 0]

        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        mape = mean_absolute_percentage_error(y_test_nonzero, y_pred_nonzero)
        r2 = r2_score(y_test, y_pred)

        current_players = player_data[['name'] + features].dropna()
        X_current = current_players[features]

        # Scale the current data
        X_current = scaler.transform(X_current)

        predictions = model.predict(X_current)
        predictions_scaled = predictions / 10

        current_players['predicted_points'] = predictions_scaled

        top_players = current_players.sort_values('predicted_points', ascending=False).head(30)

        top_player = top_players.iloc[0]

        feature_importance = pd.DataFrame({'feature': features, 'importance': model.coef_})
        feature_importance = feature_importance.sort_values('importance', ascending=False)

        return jsonify({
            'model_performance': {
                'mse': mse,
                'mae': mae,
                'mape': mape,
                'r2': r2
            },
            'top_players': top_players[['id', 'name', 'predicted_points']].to_dict('records'),
            'top_player': {
                'id': int(top_player['id'].astype(str)),
                'name': top_player['name'],
                'predicted_points': float(top_player['predicted_points'])
            },
            'feature_importance': feature_importance.to_dict('records')
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)