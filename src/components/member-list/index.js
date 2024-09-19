import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { Icon } from "@iconify/react";

const getData = async (setMembers) => {
  try {
    const res = await axios.get("http://localhost:4444/members");
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

const TH = "bg-zinc-200 p-2 font-bold";
const Cell = "p-2";
const Input = "p-2 border rounded";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const [memberData, setMemberData] = useState(initialMemberData);

  useEffect(() => {
    getData(setMembers);
  }, []);

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

  const [query, setQuery] = useState();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">My Club's Members</h1>
      <div className="mb-2 flex gap-4">
        <input
          type="search"
          className="p-4 border-2 rounded min-w-xl rounded-lg border-blue"
          placeholder="Search for a member"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="flex items-center gap-1 font-bold bg-blue px-2 py-1 rounded-xl text-white"
          onClick={createMember}
        >
          <Icon icon="tabler:plus" className="w-6 h-6"></Icon> Create Member
        </button>
      </div>
      <div className="border-2 rounded-lg">
        <div className="grid grid-cols-[1fr_1fr_1fr_3fr_1fr]">
          <div className={TH}>Name</div>
          <div className={TH}>Age</div>
          <div className={TH}>Member Rating</div>
          <div className={TH}>Activities</div>
          <div className={TH}>Actions</div>
        </div>
        {members
          .filter((member) => {
            if (!query) return true;
            return member.name.toLowerCase().includes(query.toLowerCase());
          })
          .map((member) => (
            <div
              className="grid grid-cols-[1fr_1fr_1fr_3fr_1fr]"
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
      <Modal openModal={modal} closeModal={() => setModal(false)}>
        <form className="grid p-4 gap-4" onSubmit={handleSubmit} method="post">
          <h1 className="text-3xl font-bold">
            {isNew ? "Create Member" : `Update ${memberData.name}`}
          </h1>
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
            className={Input}
          />
          <input
            required
            value={memberData.activities}
            onChange={(e) =>
              setMemberData({
                ...memberData,
                activities: e.target.value.split(","),
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
