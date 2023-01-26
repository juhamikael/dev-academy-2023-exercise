import pandas as pd
from pathlib import Path

# Bike data validation

def get_data(data_path: str):
    return pd.read_csv(data_path)


def drop_columns(dataframe: pd.DataFrame, columns_to_drop: list):
    dataframe.drop(columns=columns_to_drop, inplace=True)
    return dataframe


def replace_chars_on_column(dataframe: pd.DataFrame):
    string_list_to_replace_with_blank = [".", "(", ")"]
    dataframe.columns = dataframe.columns.str.replace(' ', '_', regex=True).str.lower()
    for char in string_list_to_replace_with_blank:
        dataframe.columns = dataframe.columns.str.replace(char, '', regex=True)

    return dataframe


def change_column_data_type(dataframe: pd.DataFrame):
    dataframe.covered_distance_m = dataframe.covered_distance_m.astype(int)
    dataframe.duration_sec = dataframe.duration_sec.astype(int)
    return dataframe


def change_column_names(dataframe, columns_to_change: dict):
    dataframe.rename(columns=columns_to_change, inplace=True)
    return dataframe


def drop_distances_and_durations_under_10(dataframe: pd.DataFrame):
    print(f"Number of rows dropped: {len(dataframe) - len(dataframe[(dataframe.covered_distance_m >= 10) & (dataframe.duration_sec >= 10)])}")
    dataframe = dataframe[(dataframe.covered_distance_m >= 10) & (dataframe.duration_sec >= 10)].copy()

    return change_column_data_type(dataframe)


def concat_dataframes(array_of_dataframes: list):
    return pd.concat(array_of_dataframes).reset_index(drop=True).reset_index(drop=True)


def dataframe_to_csv(dataframe: pd.DataFrame, filename: str) -> None:
    dataframe.to_csv(f"{filename}_new.csv", index=False)
    try:
        print(f"Dataframe saved to {filename}_new.csv")
    except FileNotFoundError:
        print("File not found")


def sort_by_column(dataframe: pd.DataFrame, sort_by: str):
    return dataframe.sort_values(by=[sort_by], ascending=True).reset_index(drop=True)


# Run the functions
# Process bikedata (2021-05, 2021-06, 2021-07)
dataframe_1 = drop_columns(
    dataframe=drop_distances_and_durations_under_10(replace_chars_on_column(get_data('./data/2021-05.csv'))),
    columns_to_drop=['departure_station_name', 'return_station_name'])
dataframe_2 = drop_columns(
    dataframe=drop_distances_and_durations_under_10(replace_chars_on_column(get_data('./data/2021-06.csv'))),
    columns_to_drop=['departure_station_name', 'return_station_name'])
dataframe_3 = drop_columns(
    dataframe=drop_distances_and_durations_under_10(replace_chars_on_column(get_data('./data/2021-07.csv'))),
    columns_to_drop=['departure_station_name', 'return_station_name'])

merged_dataframe = concat_dataframes([dataframe_1, dataframe_2, dataframe_3])

merged_dataframe = change_column_names(merged_dataframe,
                                       columns_to_change={'covered_distance_m': 'distance_m',
                                                          'duration_sec': 'duration_s',
                                                          "departure_station_id": "start_station_id",
                                                          "return_station_id": "end_station_id",
                                                          "departure": "start_time",
                                                          "return": "end_time"})
merged_dataframe = sort_by_column(merged_dataframe, 'start_time')

# Using pathlib to use current working directory
dataframe_to_csv(merged_dataframe, Path.cwd() / "data" / "bikedata")

# Process station_data.csv data
station_data = drop_columns(
    replace_chars_on_column(dataframe=get_data('./data/station_data.csv')),
    columns_to_drop=["nimi", "fid", "stad", "operaattor", "namn", "kapasiteet", "adress", "kaupunki"])
station_data = change_column_names(
    station_data, {"id": "station_id", "osoite": "address", "y": "latitude", "x": "longitude"}
)
station_data = sort_by_column(dataframe=station_data, sort_by="station_id")

dataframe_to_csv(station_data, Path.cwd() / "data" / "station_data")
