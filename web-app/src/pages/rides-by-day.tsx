import { api } from "../utils/api";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  modifyTime,
  modifySeconds,
  cordinatesWithoutSpaces,
  modifyDistance,
} from "../utils/functions/rides-by-day";

interface IRidesByDayProps {
  dateToShow: string;
}

const SplitDataIntoLists = (data: any) => {
  // Splitting the data into lists of 20
  const completeDataList = [];
  let tempList = [];
  for (let i = 0; i < data.length; i++) {
    if (i % 20 === 0 && i !== 0) {
      completeDataList.push(tempList);
      tempList = [];
    }
    tempList.push(data[i]);
  }
  completeDataList.push(tempList);
  return completeDataList;
};

const RidesByDay: React.FC<IRidesByDayProps> = () => {
  const router = useRouter();

  const { date } = router.query;
  const dateToShow = date?.toString();

  const [bikeData, setBikeData] = useState<any>([]);
  const getAll = api.trip.getAll.useQuery({ date: dateToShow || "" });

  let firstList: Array<any> = [];
  useEffect(() => {
    if (getAll.isSuccess) {
      setBikeData(SplitDataIntoLists(getAll.data));
    }
  }, [getAll.isSuccess]);

  if (dateToShow && getAll.isLoading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        Loading...
      </div>
    );

  if (getAll.isSuccess) {
    firstList = bikeData[0];
    console.log(firstList);
  }

  return (
    <main>
      <div className="my-5 flex items-center justify-center space-x-8">
        <button
          type="button"
          onClick={() => router.back()}
          className=" h-10 w-24 rounded-lg bg-blue-500 p-2 font-bold uppercase text-white hover:bg-blue-400"
        >
          Back
        </button>
        <h2 className="text-lg font-bold">
          Currently showing rides for the date <> {dateToShow} </>
        </h2>
      </div>
      <div className="flex justify-center">
        <table className="mt-10 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Ride ID</th>
              <th className="px-4 py-2">Start time</th>
              <th className="px-4 py-2">End time</th>
              <th className="px-4 py-2">Start station</th>
              <th className="px-4 py-2">End station</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Distance</th>
              <th className="px-4 py-2">Map lopcation</th>
            </tr>
          </thead>
          <tbody>
            {firstList &&
              firstList.map((ride: any) => (
                <tr key={ride.id}>
                  <td className="border px-4 py-2">{ride.id}</td>
                  <td className="border px-4 py-2">
                    {modifyTime(ride.start_time)}
                  </td>
                  <td className="border px-4 py-2">
                    {modifyTime(ride.end_time)}
                  </td>
                  <td className="border px-4 py-2">
                    {ride.start_station_name}
                  </td>
                  <td className="border px-4 py-2">{ride.end_station_name}</td>
                  <td className="border px-4 py-2">
                    {modifySeconds(ride.duration_s)}
                  </td>
                  <td className="border px-4 py-2">
                    {modifyDistance(ride.distance_m)} km
                  </td>
                  <td className="flex justify-center border px-4 py-2">
                    <div>
                      <button
                        className="rounded-xl bg-blue-500 p-2 text-xs font-bold text-white hover:bg-blue-400 "
                        onClick={() => {}}
                        type="button"
                      >
                        <Link
                          href={{
                            pathname: "/location",
                            query: `start_station_location=${cordinatesWithoutSpaces(
                              ride.start_station_location
                            )}&end_station_location=${cordinatesWithoutSpaces(
                              ride.end_station_location
                            )}`,
                          }}
                        >
                          Show on map
                        </Link>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RidesByDay;
