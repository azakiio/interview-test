const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const membersJson = require("./members.json");

let members = [...membersJson];

const app = express();

const corsOptions = { origin: "*", optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use(bodyParser.json());

const randomNumber = Math.floor(10000 + Math.random() * 90000);

app.get("/activities", (req, res) => {
  const activities = members.reduce((acc, member) => {
    member.activities.forEach((activity) => {
      if (!acc.has(activity)) {
        acc.add(activity);
      }
    });
    return acc;
  }, new Set());
  res.send([...activities]);
});

/**
 * @query query: string
 */
app.get("/members", (req, res) => {
  const query = req.query.query?.toLowerCase() || "";
  const ratings = req.query.rating || [];
  const sortBy = req.query.sort;
  let activities = req.query.activities || [];

  // Normalize `activities` to always be an array
  if (typeof activities === "string") {
    activities = [activities]; // convert single string to array
  }

  const filteredMembers = members.filter((member) => {
    let shouldInclude = true;

    // Filter by name query
    if (query) {
      shouldInclude = member.name.toLowerCase().includes(query);
    }

    // Filter by ratings (if ratings are provided)
    if (ratings.length > 0) {
      shouldInclude =
        shouldInclude && ratings.includes(member.rating.toString());
    }

    // Filter by activities (if activities are provided)
    if (activities.length > 0) {
      shouldInclude =
        shouldInclude &&
        activities.every((activity) => member.activities.includes(activity));
    }

    return shouldInclude;
  });

  //implement sorting
  if (sortBy) {
    let sortDirection = 1;
    let sortKey = sortBy;
    if (sortBy.startsWith("-")) {
      sortDirection = -1;
      sortKey = sortBy.slice(1);
    }
    filteredMembers.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) {
        return -sortDirection;
      }
      if (a[sortKey] > b[sortKey]) {
        return sortDirection;
      }
      return 0;
    });
  }

  console.log("GET filtered /members");
  res.send(filteredMembers);
});

/**
 * @body name: string required
 * @body age: integer
 * @body activities: array[string]
 * @body rating: enum [1-5]
 */
app.post("/members", (req, res) => {
  const body = req.body;
  let newMember = body;
  if (body) {
    if (!body.name) {
      res.send("Name is required");
      return;
    }
    newMember = {
      activities: [],
      ...body,
      id: randomNumber.toString(),
    };
    members.push(newMember);
  }

  console.log(members);
  res.send(newMember);
});

/**
 * @param id: string required
 *
 * @body name: string required
 * @body age: integer
 * @body activities: array[string]
 * @body rating: enum [1-5]
 */
app.patch("/members/:id", (req, res) => {
  console.log("PATCH /members");
  const id = req.params.id;
  const body = req.body;

  if (body) {
    members = members.map((member) => {
      if (member.id === id) {
        return { ...member, ...body };
      }
      return member;
    });
  }
  res.send(req.body);
});

/**
 * @param id: string required
 */
app.delete("/members/:id", (req, res) => {
  console.log("DELETE /members");
  const id = req.params.id;

  const memberIndex = members.findIndex((member) => member.id === id);
  if (memberIndex !== -1) {
    members.splice(memberIndex, 1);
    res.send("Member removed successfully");
  } else {
    res.status(404).send("Member not found");
  }
});

const PORT = 4444;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
