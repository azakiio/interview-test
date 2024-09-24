import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { Icon } from "@iconify/react";
import { useSearchParams } from "react-router-dom";

const getData = async (setMembers, searchParams) => {
  try {
    const res = await axios.get("http://localhost:4444/members", {
      params: searchParams,
    });
    setMembers(res.data);
  } catch (err) {
    console.log("ERROR", err);
  }
};

const initialMemberData = {
  id: "",
  name: "",
  age: "",
  activities: [],
  rating: "",
};

const TH = "bg-dark p-2 font-bold text-white";
const Cell = "p-2";
const Input = "p-2 border rounded border-dark";

const MemberList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [modal, setModal] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [memberData, setMemberData] = useState(initialMemberData);

  useEffect(() => {
    getData(setMembers, searchParams);
    getActivities();
  }, [searchParams]);

  const deleteMember = async (memberId) => {
    try {
      await axios.delete(`http://localhost:4444/members/${memberId}`);
      setMembers(members.filter((member) => member.id !== memberId));
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  const editMember = async (member) => {
    setIsNew(false);
    setMemberData({ ...member });
    setModal(true);
  };

  const createMember = () => {
    setIsNew(true);
    setMemberData(initialMemberData);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNew) {
      try {
        const res = await axios.post(
          "http://localhost:4444/members",
          memberData
        );
        console.log(res.data);
        setMembers([...members, res.data]);
        setModal(false);
      } catch (err) {
        console.log("ERROR", err);
      }
    } else {
      try {
        console.log(memberData);
        const res = await axios.patch(
          `http://localhost:4444/members/${memberData.id}`,
          memberData
        );
        const updatedMembers = members.map((member) => {
          if (member.id === memberData.id) {
            return res.data;
          }
          return member;
        });

        setMembers(updatedMembers);
        setModal(false);
      } catch (err) {
        console.log("ERROR", err);
      }
    }

    setMemberData(initialMemberData);
  };

  const getActivities = async () => {
    try {
      const res = await axios.get("http://localhost:4444/activities");
      setActivities(res.data);
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  const tableHeaders = [
    { name: "name", label: "Name" },
    { name: "age", label: "Age" },
    { name: "rating", label: "Member Rating" },
    { name: "activities", label: "Activities" },
  ];

  return (
    <div className="grid grid-cols-[1fr_6fr] grid-rows-[min-content_1fr] p-10 gap-4 w-full h-screen overflow-hidden items-start">
      <div className="flex col-span-full justify-between flex-wrap mb-2">
        <h1 className="text-4xl font-bold text-center">My Club's Members</h1>
        <div className="flex gap-4 justify-end">
          <input
            type="search"
            className="p-3 border-2 rounded min-w-xl rounded-lg border-blue"
            placeholder="Search for a member"
            value={searchParams.get("query") || ""}
            onChange={(e) => {
              searchParams.set("query", e.target.value);
              setSearchParams(searchParams);
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 items-start">
        <button
          className="flex items-center gap-1 font-bold bg-blue px-4 py-3 rounded-lg text-white w-fit"
          onClick={createMember}
        >
          <Icon icon="tabler:plus" className="w-6 h-6"></Icon> Create Member
        </button>
        <h2 className="text-2xl flex gap-4 justify-between font-bold -mb-4">
          Filters
          <button
            className="flex items-center gap-1 bg-blue text-white rounded-full text-sm px-2 py-1 aria-hidden:hidden"
            aria-hidden={
              !searchParams.get("activities") && !searchParams.get("rating")
            }
            onClick={() => {
              searchParams.delete("activities");
              searchParams.delete("rating");
              setSearchParams(searchParams);
            }}
          >
            <Icon icon="ic:round-close"></Icon>
            clear
          </button>
        </h2>
        <h3 className="text-xl font-bold mt-2">Activity</h3>
        <div className="pl-2 -mt-3">
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
        <h3 className="text-xl font-bold">Rating</h3>
        <div className="pl-2 -mt-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <label
                key={i}
                className="flex items-center gap-2 w-fit cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="rating"
                  value={i + 1}
                  checked={searchParams
                    .getAll("rating")
                    ?.includes(String(i + 1))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      searchParams.append("rating", i + 1);
                    } else {
                      searchParams.delete("rating", i + 1);
                    }
                    setSearchParams(searchParams);
                  }}
                />
                {Array(i + 1)
                  .fill(0)
                  .map((_, j) => (
                    <Icon icon="mdi:star" className="text-yellow w-5 h-5" />
                  ))}
              </label>
            ))
            .reverse()}
        </div>
      </div>

      <div className="rounded-xl overflow-auto h-full">
        <div className="grid grid-cols-[1fr_1fr_1fr_3fr_1fr] sticky top-0">
          {tableHeaders.map((header) => (
            <button
              onClick={() => {
                if (searchParams.get("sort") === header.name) {
                  searchParams.set("sort", `-${header.name}`);
                } else if (searchParams.get("sort") === `-${header.name}`) {
                  searchParams.delete("sort");
                } else {
                  searchParams.set("sort", header.name);
                }
                setSearchParams(searchParams);
              }}
              className={`flex items-center gap-1 ${TH}`}
            >
              {header.label}
              <Icon
                icon={
                  searchParams.get("sort") === header.name
                    ? "prime:arrow-down"
                    : searchParams.get("sort") === `-${header.name}`
                    ? "prime:arrow-up"
                    : "prime:arrows-v"
                }
                className="w-5 h-5 text-blue"
              ></Icon>
            </button>
          ))}
          <div className={TH}>Actions</div>
        </div>
        {members.map((member) => (
          <div
            className="grid grid-cols-[1fr_1fr_1fr_3fr_1fr] border-2 border-t-0 border-dark last:rounded-b-xl items-center"
            key={member.id}
          >
            <div className={Cell}>{member.name}</div>
            <div className={Cell}>{member.age}</div>
            <div className={Cell}>{member.rating}</div>
            <div className={`flex gap-2 ${Cell}`}>
              <div>{member.activities.join(", ")}</div>
            </div>
            <div className={`flex gap-2 items-center ${Cell}`}>
              <button
                onClick={() => editMember(member)}
                className="p-2 rounded-full bg-blue text-white"
              >
                <Icon icon="tabler:edit" className="w-6 h-6"></Icon>
              </button>
              <button
                onClick={() => deleteMember(member.id)}
                className="p-2 rounded-full bg-red text-white"
              >
                <Icon icon="tabler:trash" className="w-6 h-6"></Icon>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        openModal={modal}
        closeModal={() => setModal(false)}
        Title={
          <h1 className="text-3xl font-bold">
            {isNew ? "Create Member" : `Update ${memberData.name}`}
          </h1>
        }
      >
        <form className="grid p-4 gap-4" onSubmit={handleSubmit} method="post">
          <input
            required
            value={memberData.name}
            onChange={(e) =>
              setMemberData({ ...memberData, name: e.target.value })
            }
            type="text"
            name="name"
            placeholder="Name"
            className={Input}
          />
          <input
            required
            value={memberData.age}
            onChange={(e) =>
              setMemberData({ ...memberData, age: e.target.value })
            }
            type="number"
            name="age"
            placeholder="Age"
            min={0}
            max={120}
            className={Input}
          />
          <input
            required
            value={memberData.activities}
            onChange={(e) =>
              setMemberData({
                ...memberData,
                activities: e.target.value.split(",").map((a) => a.trim()),
              })
            }
            type="text"
            name="activities"
            placeholder="Activities"
            className={Input}
          />
          <input
            required
            value={memberData.rating}
            onChange={(e) =>
              setMemberData({ ...memberData, rating: e.target.value })
            }
            type="number"
            name="rating"
            placeholder="Rating"
            min={1}
            max={5}
            className={Input}
          />
          <button type="submit" className="btn">
            {isNew ? "Create" : "Update"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MemberList;
