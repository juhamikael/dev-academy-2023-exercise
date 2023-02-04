import { api } from "../utils/api";
import { useRouter } from "next/router";
import Pagination from "../components/Pagination";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import type { IRide } from "../utils/types/RidesByDay";

import {
  coordinatesWithoutSpaces,
  getStartTimeFromDate,
  modifyDistance,
  modifySeconds,
  modifyTime,
  replaceNordics,
  splitDataIntoLists,
} from "../utils/functions/rides-by-day";

const RidesByDay = () => {
  const router = useRouter();
  const { date } = router.query;
  const dateToShow = date?.toString() ?? "";
  const [bikeData, setBikeData] = useState<IRide[][]>([]);
  const getAll = api.trip.getAll.useQuery({ date: dateToShow || "" });
  const [totalRides, setTotalRides] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  let firstList: IRide[] | undefined = [];
  useEffect(() => {
    if (getAll.isSuccess) {
      setTotalRides(getAll.data.length);
      setBikeData(splitDataIntoLists(getAll.data));
    }
    if (dateToShow) {
      // When current page change, modify url
      void router.push({
        pathname: "/rides-by-day",
        query: { date: dateToShow, page: currentPage },
      });
    }
  }, [getAll.isSuccess, currentPage]);

  if (dateToShow && getAll.isLoading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-5 text-2xl">
        <div>Loading...</div>
        <CircularProgress />
      </div>
    );

  if (getAll.isSuccess) {
    firstList = bikeData[currentPage - 1];
  }
  return (
    <main>
      <div className="my-5 flex items-center justify-center space-x-8">
        <button
          type="button"
          onClick={() => void router.push("/")}
          className=" h-10 w-24 rounded-lg bg-blue-500 p-2 font-bold uppercase text-white hover:bg-blue-400"
        >
          Back
        </button>

        <div className="mt-5 flex flex-col">
          <h2 className="text-3xl font-bold">
            Currently showing rides for the date <> {dateToShow} </>
          </h2>
          <div>
            <span className="text-2xl font-bold">
              Total rides: <>{totalRides}</>
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center ">
        <div className="flex justify-center ">
          <div className="mt-5 flex w-11/12 justify-center overflow-hidden rounded-t-2xl">
            <table className="w-full table-auto">
              <thead className="h-14">
                <tr className=" bg-gray-800 text-white">
                  <th className="w-1/12 py-1 text-sm">#</th>
                  <th className="w-1/12 py-1 text-sm">Start time</th>
                  <th className="w-1/12 py-1 text-sm">End time</th>
                  <th className="w-3/12 py-1 text-sm">Start station</th>
                  <th className="w-3/12 py-1 text-sm">End station</th>
                  <th className="w-1/12 py-1 text-sm">Duration</th>
                  <th className="w-1/12 py-1 text-sm">Distance</th>
                </tr>
              </thead>
              <tbody>
                {firstList &&
                  firstList.map((ride) => (
                    <tr
                      className="cursor-pointer content-center text-center hover:bg-blue-100/50"
                      key={ride.id}
                      onClick={() => {
                        void router.push({
                          pathname: "/location",
                          query: `date=${dateToShow}&page=${currentPage}&start_station_location=${coordinatesWithoutSpaces(
                            ride.start_station_location
                          )}&end_station_location=${coordinatesWithoutSpaces(
                            ride.end_station_location
                          )}&start_station_name=${replaceNordics(
                            ride.start_station_name
                          )}&end_station_name=${replaceNordics(
                            ride.end_station_name
                          )}&duration_s=${ride.duration_s}&distance_m=${
                            ride.distance_m
                          }&start_time=${getStartTimeFromDate(
                            ride.start_time
                          )}&id=${ride.id}`,
                        });
                      }}
                    >
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
                      <td className="w-20 border px-4 py-2">
                        {ride.end_station_name}
                      </td>
                      <td className="w-10 border px-4 py-2">
                        {modifySeconds(ride.duration_s)}
                      </td>
                      <td className="border px-4 py-2">
                        {modifyDistance(ride.distance_m)} km
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="my-5 flex justify-center">
          <Pagination
            totalPages={bikeData.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
};

export default RidesByDay;
