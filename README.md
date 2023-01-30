# Helsinki city bike app (Dev Academy pre-assignment)

## Preqrequisites

- Python 3.9 or higher
- Jupyter Notebook (if using the Jupyter Notebook option for the validation script)
- Access to the data files (2021-05.csv, 2021-06.csv, 2021-07.csv, station_data.csv) located in ./validate/data.zip

## 1 Description
### 1.1. Stack & Tools
- Using Python / Jupyter Notebook for data validation
- Using [T3 Stack](https://create.t3.gg/) for backend and frontend
   - Next.js
   - Tailwind CSS (Styling)
   - Prisma ORM
   - tRPC (API)

### 1.2. Information about the data
#### Data: 2021-05.csv - 2021-06.csv - 2021-07.csv

---

#### The data was validated and processed by following:

1. Rows removed ~ 1.7 million:
   - Trips under 10 second were removed
   - Trips under 10 meters were removed
   - Duplicates were removed
2. Columns 'departure_station_name', 'return_station_name' were removed
3. Modifications on column names:
   - Whitespaces were replaced with underscores
   - Other special characters were removed
   - Converted all letters to lowercase
4. Column names renamed by following:
   - Departure -> start_time
   - Return -> end_time
   - Covered distance (m) -> distance_m
   - Duration (sec.) -> duration_s
   - Departure station id -> start_station_id
   - Return station id -> end_station_id
5. All the data were merged into one file and sorted by start_time


---

#### Data: station_data.csv

---

#### The data was validated and processed by following:

1. All the column names were converted to lowercase
2. Dropped columns:
   - nimi
   - fid
   - stad
   - operaattor
   - namn
   - kapasiteet
   - adress
   - kaupunki
3. Column names were changed by following:
   - id -> station_id
   - osoite -> address
   - y -> latitude
   - x -> longitude
4. The data were sorted by station_id saved as 'station_data_new.csv'

#### Both data files were merged into one file resulting following dataframe.
Latitude and longitude were combined from stations_data.cvs to one column and stored into columns 'start_station_location' and 'end_station_location'
``` 
id
start_time
end_time
start_station_id
start_station_name
start_station_location
end_station_id
end_station_name
end_station_location
distance_m
duration_s
```

---

### 1.3. Database design
```Prisma
model Trip {
    id                     Int      @id @default(autoincrement())
    start_time             DateTime
    end_time               DateTime
    start_station_id       Int
    start_station_name     String
    start_station_location String
    end_station_id         Int
    end_station_name       String
    end_station_location   String
    distance_m             Int
    duration_s             Int
}
```
![tietokanta arkkitehtuuri (1)](https://user-images.githubusercontent.com/83360104/215287924-8e0fdeb8-89e1-4d26-b3ce-f2fdbf2fc2d2.png)




## 2 Installation

### 1. Validate data with Python

Provided data were processed with Python script which you can find in the 'validation' folder.

#### Data:

```
2021-05.csv
2021-06.csv
2021-07.csv
station_data.csv
```

There is 2 options to run the validation script:
With Jupyter Notebook or with pure Python.

#### 1 Jupyter Notebook

Make sure you have Jupyter Notebook installed.
Open the validate_data.ipynb file and run all cells.

#### 2 Python

Make sure you have Python 3.9 or higher installed.
Open the terminal and run the following commands:

```
cd validate
python -m venv venv
venv/scripts/activate
pip install -r requirements.txt
python validate_data.py
```

### 2. Database

Hosted in [Planetscale](https://planetscale.com/) // Using hobby plan
Recommended tools: [TablePlus](https://tableplus.com/) for populating (importing) CSV datafile



#### 1 Push models

```
npx prisma db push
```

### 3. Running the backend

#### WIP

### 4. Running the frontend

#### WIP

## 3 Usage

### WIP
