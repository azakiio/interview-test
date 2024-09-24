import { Icon } from "@iconify/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "../Modal";
import Filters from "./Filters";

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
  const [modal, setModal] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [memberData, setMemberData] = useState(initialMemberData);
  const lastExecutedRef = useRef(0); // Track last execution time

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutedRef.current;
    const interval = 100;

    if (timeSinceLastExecution >= interval) {
      getData(setMembers, searchParams);
      lastExecutedRef.current = now;
    } else {
      // Otherwise, schedule to run after the remaining time
      const timeoutId = setTimeout(() => {
        getData(setMembers, searchParams);
        lastExecutedRef.current = Date.now();
      }, interval - timeSinceLastExecution);

      return () => clearTimeout(timeoutId);
    }
  }, [searchParams]);

  // useEffect(() => {
  //   getData(setMembers, searchParams);
  // }, [searchParams]);

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

  const tableHeaders = [
    { name: "name", label: "Name" },
    { name: "age", label: "Age" },
    { name: "rating", label: "Rating" },
    { name: "activities", label: "Activities" },
  ];

  return (
    <div
      className="relative grid md:grid-cols-[1fr_6fr] md:grid-rows-[min-content_1fr] p-4 md:p-10 gap-4 w-full content-start h-screen"
      un-cloak
    >
      <div className="flex col-span-full flex-wrap mb-2 items-center gap-3">
        <h1 className="text-4xl font-bold text-center">My Club's Members</h1>
        <button
          className="btn flex items-center gap-1 font-bold bg-blue p-2 rounded-full text-white w-fit"
          onClick={createMember}
        >
          <Icon icon="humbleicons:user-add" className="w-6 h-6"></Icon>
        </button>

        <input
          type="search"
          className="p-3 border-2 rounded max-w-lg w-full rounded-lg border-blue ml-auto"
          placeholder="Search for a member"
          value={searchParams.get("query") || ""}
          onChange={(e) => {
            searchParams.set("query", e.target.value);
            setSearchParams(searchParams);
          }}
        />
      </div>

      <Filters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        members={members}
      />

      <div className="rounded-xl overflow-auto h-full">
        <div className="grid grid-cols-[1fr_1fr_1fr_3fr_1fr] sticky top-0 min-w-xl">
          {tableHeaders.map((header) => (
            <button
              key={header.name}
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
            className="grid grid-cols-[1fr_1fr_1fr_3fr_1fr] border-2 border-t-0 border-dark last:rounded-b-xl items-center min-w-xl"
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
                className="btn p-2 rounded-full bg-blue text-white"
              >
                <Icon icon="tabler:edit" className="w-6 h-6"></Icon>
              </button>
              <button
                onClick={() => deleteMember(member.id)}
                className="btn p-2 rounded-full bg-red text-white"
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
          <button
            type="submit"
            className="btn bg-blue! text-white py-3 rounded-lg"
          >
            {isNew ? "Create" : "Update"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MemberList;
