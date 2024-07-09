import React from "react";

function StatisticsPage() {
  const graphContainerClass =
    "flex flex-col gap-4 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2";
  return (
    <div>
      <div className="flex flex-col gap-8 m-4">
        <h1 className="text-2xl text-center">Statistics</h1>

        <div className="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-3 items-center text-center ">
          <div className={graphContainerClass}>
            Kerskimääräinen merkintämäärä: 0
          </div>
          <div className={graphContainerClass}>
            Keskimääräinen urheiltu aika: 0
          </div>
          <div className={graphContainerClass}>Uudet opiskelijat: 0</div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-3 items-center text-center ">
          <div>Opiskelijat: 0</div>
          <div>Urheiluajat: 0</div>
          <div>Merkinnät: 0</div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
