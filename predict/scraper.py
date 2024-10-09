import requests
import pandas as pd
import numpy as np
from datetime import datetime
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "https://fantasy.premierleague.com/api/"

def fetch_fpl_data():
    logger.info("Starting data fetch")
    
    try:
        players_response = requests.get(f"{BASE_URL}bootstrap-static/")
        players_data = players_response.json()['elements']
        
        df_players = pd.DataFrame(players_data)
        
        historical_data = []
        for player in players_data:
            player_id = player['id']
            history_response = requests.get(f"{BASE_URL}element-summary/{player_id}/")
            player_history = history_response.json()['history']
            
            for game in player_history:
                game['element'] = player_id
                historical_data.append(game)

        df_history = pd.DataFrame(historical_data)

        df_merged = pd.merge(df_history, df_players, left_on='element', right_on='id')

        df_merged = df_merged.sort_values(by=['element', 'round'])
        
        df_merged['assists_mean'] = df_merged.groupby('element')['assists_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['bonus_mean'] = df_merged.groupby('element')['bonus_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['bps_mean'] = df_merged.groupby('element')['bps_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['clean_sheets_mean'] = df_merged.groupby('element')['clean_sheets_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['creativity_mean'] = df_merged.groupby('element')['creativity_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['goals_conceded_mean'] = df_merged.groupby('element')['goals_conceded_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['goals_scored_mean'] = df_merged.groupby('element')['goals_scored_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['ict_index_mean'] = df_merged.groupby('element')['ict_index_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['influence_mean'] = df_merged.groupby('element')['influence_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['minutes_mean'] = df_merged.groupby('element')['minutes_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['own_goals_mean'] = df_merged.groupby('element')['own_goals_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['penalties_missed_mean'] = df_merged.groupby('element')['penalties_missed_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['penalties_saved_mean'] = df_merged.groupby('element')['penalties_saved_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())

        df_merged['points_last_3'] = df_merged.groupby('element')['total_points_x'].transform(lambda x: x.rolling(window=3, min_periods=1).mean())
        df_merged['points_last_5'] = df_merged.groupby('element')['total_points_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['points_last_game'] = df_merged.groupby('element')['total_points_x'].shift(1)
        df_merged['points_two_games_ago'] = df_merged.groupby('element')['total_points_x'].shift(2)

        df_merged['red_cards_mean'] = df_merged.groupby('element')['red_cards_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['saves_mean'] = df_merged.groupby('element')['saves_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['selected_mean'] = df_merged.groupby('element')['selected'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['threat_mean'] = df_merged.groupby('element')['threat_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['total_points_mean'] = df_merged.groupby('element')['total_points_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['transfers_balance_mean'] = df_merged.groupby('element')['transfers_balance'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['transfers_in_mean'] = df_merged.groupby('element')['transfers_in_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['transfers_out_mean'] = df_merged.groupby('element')['transfers_out_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['value_mean'] = df_merged.groupby('element')['value'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        df_merged['yellow_cards_mean'] = df_merged.groupby('element')['yellow_cards_x'].transform(lambda x: x.rolling(window=5, min_periods=1).mean())
        
        df_merged['y'] = df_merged['total_points_x'] 
        
        current_date = datetime.now().strftime("%Y-%m-%d")
        filename = f"fpl_data_{current_date}.csv"
        df_merged.to_csv(filename, index=False)
        logger.info(f"Data saved to {filename}")
        
        return filename
    except Exception as e:
        logger.error(f"Error fetching data: {str(e)}")
        return None