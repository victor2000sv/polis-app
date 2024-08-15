const axios = require("axios");

module.exports = function ({ db }) {
  const exports = {};

  const formatDate = (day, month, year, time) => {
    const months = {
      januari: "01",
      februari: "02",
      mars: "03",
      april: "04",
      maj: "05",
      juni: "06",
      juli: "07",
      augusti: "08",
      september: "09",
      oktober: "10",
      november: "11",
      december: "12",
    };

    return `${year}-${months[month.toLowerCase()]}-${day.padStart(
      2,
      "0"
    )} ${time}`;
  };

  const getDataByDate = async (date) => {
    const apiEndpoint = `https://polisen.se/api/events?DateTime=${
      date.toISOString().split("T")[0]
    }`;

    const { data: result } = await axios.get(apiEndpoint);

    const events = result
      .filter((item) => !item.type.includes("Sammanfattning"))
      .map((item) => {
        const dateTime = item.name.split(",")[0];
        const [day, month, time] = dateTime.split(" ");
        const [latitude, longitude] = item.location.gps.split(",");

        return {
          id: item.id,
          type: item.type,
          summary: item.summary,
          date: formatDate(
            day,
            month,
            item.datetime.split("-")[0],
            time.replace(".", ":")
          ),
          latitude,
          longitude,
        };
      });

    return events;
  };

  const uploadEvent = async (event) => {
    const { event_id, summary, type, longitude, latitude, date } = event;
    await db.query("INSERT INTO events VALUES (?, ?, ?, ?, ?, ?);", [
      event_id,
      summary,
      type,
      longitude,
      latitude,
      date,
    ]);
  };

  exports.setup = async () => {
    const results = await db.query(
      "SELECT COUNT(event_id) AS count FROM events"
    );

    const count = results && parseInt(results[0].count);

    if (count > 0)
      throw { code: "ALREADY_SETUP", message: "The db is already setup" };

    try {
      let eventList = [];
      let searchDate = new Date();

      let allTypes = await db.query("SELECT * FROM types;");
      allTypes = allTypes.reduce((map, obj) => {
        map[obj.title] = obj.type_id;
        return map;
      }, {});
      while (true) {
        const events = await getDataByDate(searchDate);
        console.log(
          `Found ${events.length} results for the date: ${
            searchDate.toISOString().split("T")[0]
          }`
        );

        if (events.length == 0) break;
        eventList = [...eventList, ...events];
        searchDate.setDate(searchDate.getDate() - 1);
      }

      const promises = eventList
        .map((event) => ({
          event_id: event.id,
          summary: event.summary,
          type: allTypes[event.type],
          longitude: event.longitude,
          latitude: event.latitude,
          date: event.date,
        }))
        .filter((event) => event.type !== undefined)
        .map((event) => uploadEvent(event));

      await Promise.all(promises);
      console.log(`Database setup complete.`);
    } catch (e) {
      console.error(e);
    }
  };

  exports.startLoop = async () => {
    let allTypes = await db.query("SELECT * FROM types;");
    allTypes = allTypes.reduce((map, obj) => {
      map[obj.title] = obj.type_id;
      return map;
    }, {});

    const loop = async () => {
      let lastInsertedResult = await db.query(
        "SELECT event_id AS last_inserted FROM events ORDER BY event_id DESC LIMIT 1;"
      );

      const { last_inserted: lastInserted } = lastInsertedResult[0];

      const events = await getDataByDate(new Date());
      const promises = events
        .filter((event) => event.id > lastInserted)
        .map((event) => ({
          event_id: event.id,
          summary: event.summary,
          type: allTypes[event.type],
          longitude: event.longitude,
          latitude: event.latitude,
          date: event.date,
        }))
        .filter((event) => event.type !== undefined)
        .map((event) => uploadEvent(event));

      if (promises.length > 0) {
        console.log(`${promises.length} new events registered.`);

        await Promise.all(promises);
      }
    };

    const interval = setInterval(() => {
      loop();
    }, 10000);
  };

  return exports;
};
