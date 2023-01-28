# Read the function docstrings for more in depth information about the functions.
import pandas as pd
from tqdm import tqdm
from pathlib import Path


def get_data(data_path: str):
    """
    Reads the csv file at the given path and returns a dataframe.

    Parameters:
    data_path (str): path to the csv file

    Returns:
    pd.DataFrame: dataframe with the data from the csv file
    """
    return pd.read_csv(data_path)


def drop_columns(dataframe: pd.DataFrame, columns_to_drop: list):
    """
    Drops the given columns from the input dataframe.

    Parameters:
    dataframe (pd.DataFrame): dataframe to be modified
    columns_to_drop (list): list of columns to be dropped

    Returns:
    pd.DataFrame: processed dataframe with the dropped columns
    """
    dataframe.drop(columns=columns_to_drop, inplace=True)
    return dataframe


def replace_chars_on_column(dataframe: pd.DataFrame):
    """
    Replaces the characters in the column names with underscores and lowercases the column names.

    Parameters:
    dataframe (pd.DataFrame): dataframe to be modified

    Returns:
    pd.DataFrame: processed dataframe with the renamed columns
    """
    string_list_to_replace_with_blank = [".", "(", ")"]
    dataframe.columns = dataframe.columns.str.replace(' ', '_', regex=True).str.lower()
    for char in string_list_to_replace_with_blank:
        dataframe.columns = dataframe.columns.str.replace(char, '', regex=True)

    return dataframe


def change_column_data_type(dataframe: pd.DataFrame):
    """
    Change the data type of the columns 'covered_distance_m' and 'duration_sec' to int.

    Parameters:
    dataframe (pd.DataFrame): dataframe to be modified

    Returns:
    pd.DataFrame: dataframe with the changed data types
    """
    dataframe.covered_distance_m = dataframe.covered_distance_m.astype(int)
    dataframe.duration_sec = dataframe.duration_sec.astype(int)
    return dataframe


def change_column_names(dataframe, columns_to_change: dict):
    """
    Changes the column names in the input dataframe to the given column names.

    Parameters:
    dataframe (pd.DataFrame): dataframe to be modified
    columns_to_change (dict): dictionary with the old column names as keys and the new column names as values

    Returns:
    pd.DataFrame: dataframe with the changed column names
    """
    dataframe.rename(columns=columns_to_change, inplace=True)
    return dataframe


def drop_distances_and_durations_under_10(dataframe: pd.DataFrame):
    """ Drops rows where covered_distance_m is less than 10 and duration_sec is less than 10.

    Parameters:
    dataframe (pd.DataFrame): dataframe to be cleaned

    Returns:
    pd.DataFrame: cleaned dataframe

    """
    dataframe_size = len(dataframe)

    dataframe.drop_duplicates(inplace=True)
    dataframe = dataframe[(dataframe.covered_distance_m >= 10) & (dataframe.duration_sec >= 10)].copy()
    dataframe = dataframe[dataframe.covered_distance_m.notna()].copy()

    dataframe_new_size = len(dataframe)

    print(f"Number of rows dropped: {dataframe_size - dataframe_new_size}\n{'-' * 50}")

    return dataframe


def concat_dataframes(array_of_dataframes: list):
    """ Concatenates the input dataframes into one dataframe.

    Parameters:
    array_of_dataframes (list): list of dataframes to be concatenated

    Returns:
    pd.DataFrame: concatenated dataframe

    """
    return pd.concat(array_of_dataframes).reset_index(drop=True).reset_index(drop=True)


def change_time_format(dataframe: pd.DataFrame):
    """ Changes the format of the 'start_time' and 'end_time' columns in the input dataframe.

    Parameters:
    dataframe (pd.DataFrame): dataframe to be modified

    Returns:
    pd.DataFrame: dataframe with the changed time format
    """
    time = ['start_time', 'end_time']
    for when in time:
        dataframe[when] = pd.to_datetime(dataframe[when], format='%Y-%m-%d %H:%M:%S')

    return dataframe


def dataframe_to_csv(dataframe: pd.DataFrame, filename: str, indx: bool) -> None:
    """ Saves the input dataframe to a csv file with the given filename.
    When indx is True, the index column will be saved to the csv file.
    Also convert 'start_time' and 'end_time' columns in dataframe to datetime.
    We use this since SQL Lite wants an index column but Postgres does not.

    Parameters:
    dataframe (pd.DataFrame): dataframe to be saved
    filename (str): name of the file
    indx (bool): True if index is to be saved, False if not

    Returns:
    None
    """
    if indx:
        dataframe.index.name = "id"
        dataframe.index += 1

    if filename == "helsinki_bike_data":
        dataframe = change_time_format(dataframe)

    print(f"Saving dataframe, please wait...\n")
    dataframe.to_csv(Path.cwd() / 'data' / f"{filename}_new.csv", index=indx, sep=";", encoding='utf-8', header=True)

    try:
        print(f"Dataframe saved to {filename}_new.csv")
    except FileNotFoundError:
        print("File not found")


def sort_by_column(dataframe: pd.DataFrame, sort_by: str):
    """ Sorts the input dataframe by the given column name.

    Parameters:
    dataframe (pd.DataFrame): dataframe to be sorted
    sort_by (str): column name to sort by

    Returns:
    pd.DataFrame: sorted dataframe
    """
    return dataframe.sort_values(by=[sort_by], ascending=True).reset_index(drop=True)


def combine_lat_long(row, start: bool = True):
    if start:
        return f"{row['start_station_latitude']}, {row['start_station_longitude']}"
    else:
        return f"{row['end_station_latitude']}, {row['end_station_longitude']}"


def merge_station_data_and_bike_data(bike_data: pd.DataFrame, station_data: pd.DataFrame):
    """ Merges the input dataframes into one dataframe.

    Merged columns:
    id, start_time, end_time, start_station_id, start_station_name, start_station_location, end_station_id, end_station_name, end_station_location, distance_m, duration_s

    Parameters:
    bike_data (pd.DataFrame): dataframe containing bike data
    station_data (pd.DataFrame): dataframe containing station data

    Returns:
    pd.DataFrame: merged dataframe
    """
    tqdm.pandas()
    merged_df = pd.merge(bike_data, station_data, left_on="start_station_id", right_on="station_id", how="left")
    merged_df = pd.merge(merged_df, station_data, left_on="end_station_id", right_on="station_id", how="left")
    merged_df = merged_df.rename(columns={"name_x": "start_station_name", "address_x": "start_station_address",
                                          "longitude_x": "start_station_longitude",
                                          "latitude_x": "start_station_latitude",
                                          "name_y": "end_station_name", "address_y": "end_station_address",
                                          "longitude_y": "end_station_longitude", "latitude_y": "end_station_latitude"})
    merged_df = merged_df.drop(
        columns=["station_id_x", "station_id_y", "end_station_address", "start_station_address"])

    print(
        f"\nCombining latitude and longitude into one column, start_station_location and end_station_location\n{'-' * 100}")
    merged_df["start_station_location"] = merged_df.progress_apply(lambda row: combine_lat_long(row, start=True),
                                                                   axis=1)
    merged_df["end_station_location"] = merged_df.progress_apply(lambda row: combine_lat_long(row, start=False), axis=1)

    merged_df = merged_df.drop(
        columns=["start_station_latitude", "start_station_longitude", "end_station_latitude", "end_station_longitude"])

    merged_df = merged_df.reindex(
        columns=["start_time", "end_time", "start_station_id", "start_station_name", "start_station_location",
                 "end_station_id", "end_station_name", "end_station_location",
                 "distance_m", "duration_s"])

    return merged_df


"""
Section: Run the functions
1. Process bikedata (2021-05, 2021-06, 2021-07) and save the dataframes to csv files.
"""

print(f"Cleaning bikedata\n{'-' * 100}")
dataframe_1 = change_column_data_type(drop_columns(
    dataframe=drop_distances_and_durations_under_10(replace_chars_on_column(get_data('./data/2021-05.csv'))),
    columns_to_drop=['departure_station_name', 'return_station_name']))
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

"""
2. Process station_data.csv and save the dataframe to a csv file.
"""
stations = drop_columns(
    replace_chars_on_column(dataframe=get_data('./data/station_data.csv')),
    columns_to_drop=["nimi", "fid", "stad", "operaattor", "namn", "kapasiteet", "adress", "kaupunki"])
station_data = change_column_names(
    stations, {"id": "station_id", "osoite": "address", "y": "latitude", "x": "longitude"}
)

merged_dataframe = merge_station_data_and_bike_data(bike_data=merged_dataframe, station_data=stations)

merged_dataframe = sort_by_column(merged_dataframe, 'start_time')
dataframe_to_csv(dataframe=merged_dataframe, filename="helsinki_bike_data", indx=True)
