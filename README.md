# Helsinki city bike app (Dev Academy pre-assignment)

# Preqrequisites
This application is developed using Windows 10. Therefore, the project build guide,commands and installers are specific to Windows 10.
- Python 3.9 or higher
- Jupyter Notebook (if using the Jupyter Notebook option for the validation script)
- Access to the data files (2021-05.csv, 2021-06.csv, 2021-07.csv, station_data.csv) located in ./validate/data.zip
- [MySQL (MySQL Workbench)](https://dev.mysql.com/downloads/mysql/)
- [Tableplus](https://docs.tableplus.com/)

# 1 Description
## 1.1. Stack & Tools
- Using Python / Jupyter Notebook for data validation
- Using [T3 Stack](https://create.t3.gg/) for backend and frontend
   - Next.js
   - Tailwind CSS (Styling)
   - Prisma ORM
   - tRPC (API)

## 1.2. Information about the data
### Data: 2021-05.csv - 2021-06.csv - 2021-07.csv

---

### The data was validated and processed by following:

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

### Data: station_data.csv

---

### The data was validated and processed by following:

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

### Both data files were merged into one file resulting following dataframe.
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

## 1.3. Database design
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




# 2 Installation

## 2.1. Validate data with Python

Provided data were processed with Python script which you can find in the 'validation' folder.

### Data:

```
2021-05.csv
2021-06.csv
2021-07.csv
station_data.csv
```

There is 2 options to run the validation script:
With Jupyter Notebook or with pure Python.

### 2.1.1 Jupyter Notebook

Make sure you have Jupyter Notebook installed.
Open the validate_data.ipynb file and run all cells.

### 2.1.2 Python

Make sure you have Python 3.9 or higher installed.
Open the terminal and run the following commands:

```
cd validate
python -m venv venv
venv/scripts/activate
pip install -r requirements.txt
python validate_data.py
```

## 2.2. web-app:
```
cd web-app
npm install
```
## 2.3. Database

- Hosted in [Planetscale](https://planetscale.com/) (Using hobby plan)
- Recommended tools: 
   - [TablePlus](https://tableplus.com/) for populating (importing) CSV datafile
   - [Jetbrains Datagrip](https://www.jetbrains.com/datagrip/) for querying data etc.
   - 


### 2.3.1. Connect database 

#### 2.3.1.1 **Planetbase Connection:** 
Follow along with this straight forward [Video](https://www.youtube.com/watch?v=HDOfFC_Bl1E) by official Planetscale team, and use TablePlus tool to create connection
<br/>
<br/>
![planetscale (2)](https://user-images.githubusercontent.com/83360104/215639380-bbd9bc31-78a6-4ca5-bff5-d85be520ef5c.png)

> # From the connect with dropdown, select `Prisma`

![planetscale](https://user-images.githubusercontent.com/83360104/215636590-4909a16d-5b43-4d97-a8da-9a5ba9c6a91c.png)

##### Create .env file to repo root and store the value planetscale is giving you! See the image above

> ### Open our repo on terminal,  `cd web-app` and run command :
```
npx prisma db push
```

---

#### 2.3.1.2. **Local connection:** 
I used MySQL Workbench while setting server up so it is recommended to follow along with this [Video](https://www.youtube.com/watch?v=u96rVINbAUI) if you don't have it installed. 

If you've set up MySQL server locally before and know how to do it, just skip that video and follow these steps:
<br/>
<br/>
![step1-2](https://user-images.githubusercontent.com/83360104/215642140-16d2493d-8676-4654-87b3-8bb32ee8993b.png)  
<br/>
![step3-6](https://user-images.githubusercontent.com/83360104/215642225-e82b55d9-f756-4d97-990c-34c17c717660.png)
<br/>

```
DATABASE_URL=mysql://root:password@127.0.0.1:3306/helsinki-city-bike
```

```
npx prisma db push
```

![step7-10](https://user-images.githubusercontent.com/83360104/215642258-174640e0-dcc0-4d31-bcfd-fe41201ee5d4.png)

---
### 2.3.2 Populate database (Import CSV file)
We use TablePlus also for importing since it's a simple way to import data and a lot faster than for example, SQL Workbench.
1. Which ever connection you choce, open your TablePlus connection by doubleclicking the it e.g. `Local - Helsinki-city-bike`.
2. Right click your `trip` table and choose `Import -> from CSV`:  
![image](https://user-images.githubusercontent.com/83360104/215642820-3faae75e-d878-46b4-891d-602879e24065.png)  
3. Locate the previously created CSV file from repo `\validate\data` and click open  
![image](https://user-images.githubusercontent.com/83360104/215643080-d13574f4-fc82-4306-a5dc-1bd8e8b40afa.png)  
4. Change delimiter to `;` and click import
![import](https://user-images.githubusercontent.com/83360104/215643573-117689f1-b4b6-4d47-bd1c-2c624e76fba8.png)  
5. Depending on your connection, this will take a while (longer if you choce PlanetScale)  
![image](https://user-images.githubusercontent.com/83360104/215643870-a60a484b-7cfe-4f91-935b-fb3640ce93d0.png)  
6. When it's done, hit CTRL + R to reload the data. 
   - On localhost you see it immediately. 
   - With a PlanetScale connection, it might take a while to see the data.
7. Try to query the data with:   
<br/>
   
```
SELECT * FROM trip WHERE start_time BETWEEN '2021-07-05 00:00:00' AND '2021-07-05 23:59:59';
```

<br/>

![query](https://user-images.githubusercontent.com/83360104/215648377-708dd792-9185-4bfe-8c1c-2ab6173af71f.png)

---
## Frontend: 
### Root: 
![image](https://user-images.githubusercontent.com/83360104/216356816-214b7157-d4bc-4582-b541-abd8390aecc3.png)
### Table view: 
![image](https://user-images.githubusercontent.com/83360104/216357080-8000f4c1-1f44-4e54-ada7-bb694ae70c42.png)
### Google maps view
![image](https://user-images.githubusercontent.com/83360104/216357219-7591ef45-978f-4bc2-831a-4f8d4a783feb.png)

### TODO
- Fix typescript and other errors
- Add pagination
- ?

