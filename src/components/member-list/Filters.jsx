import { Icon } from "@iconify/react";
import React from "react";

const Filters = ({ searchParams, setSearchParams, activities }) => {
  return (
    <div className="flex flex-wrap gap-4 items-start justify-start content-start">
      <button
        className="btn flex items-center gap-1 bg-blue text-white rounded-full text-sm px-2 py-1 disabled:opacity-40"
        disabled={
          !searchParams.get("activities") && !searchParams.get("rating")
        }
        onClick={() => {
          searchParams.delete("activities");
          searchParams.delete("rating");
          setSearchParams(searchParams);
        }}
      >
        <Icon icon="ic:round-close"></Icon>
        clear filters
      </button>

      <div>
        <h3 className="text-xl font-bold">Activity</h3>
        {activities.map((activity) => (
          <label
            key={activity}
            className="flex items-center gap-2 w-fit cursor-pointer"
          >
            <input
              type="checkbox"
              name="activity[]"
              value={activity}
              checked={searchParams.getAll("activities")?.includes(activity)}
              onChange={(e) => {
                if (e.target.checked) {
                  searchParams.append("activities", activity);
                } else {
                  searchParams.delete("activities", activity);
                }
                setSearchParams(searchParams);
              }}
            />
            {activity}
          </label>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-bold">Rating</h3>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <label
              key={i}
              className="flex items-center gap-2 w-fit cursor-pointer py-1"
            >
              <input
                id={`rating-${i}`}
                type="checkbox"
                name="rating"
                value={i + 1}
                checked={searchParams.getAll("rating")?.includes(String(i + 1))}
                onChange={(e) => {
                  if (e.target.checked) {
                    searchParams.append("rating", i + 1);
                  } else {
                    searchParams.delete("rating", i + 1);
                  }
                  setSearchParams(searchParams);
                }}
              />
              <div className="flex pointer-events-none">
                {Array(i + 1)
                  .fill(0)
                  .map((_, j) => (
                    <Icon
                      key={j}
                      icon="mdi:star"
                      className="text-yellow w-5 h-5"
                    />
                  ))}
              </div>
            </label>
          ))
          .reverse()}
      </div>
    </div>
  );
};

export default Filters;
