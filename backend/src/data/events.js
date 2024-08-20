module.exports = function ({ db }) {
  async function getAll(date = null) {
    const startDate = date !== null ? new Date(date) : new Date();

    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const events = await db.query(
      "SELECT * FROM events WHERE date >= ? AND date < ?;",
      [startDate.toJSON().slice(0, 10), endDate.toJSON().slice(0, 10)]
    );

    return events;
  }
  async function listAll(perPage, page) {
    const events = await db.query(
      "SELECT * FROM events ORDER BY DATE(date) DESC LIMIT ? OFFSET ?;",
      [parseInt(perPage), (parseInt(page) - 1) * parseInt(perPage)]
    );

    return events;
  }
  async function getTypes() {
    const types = await db.query("SELECT * FROM types;");
    return types;
  }
  async function getById(id) {
    const eventData = await db.query(
      "SELECT events.*, types.title AS type_title FROM events JOIN types ON types.type_id = events.type WHERE event_id = ? LIMIT 1",
      [id]
    );

    const thisYear = parseInt(new Date().getFullYear());
    const event = eventData && eventData[0];

    const statistics = {
      numberOfOccurencesInTheArea: await getNumberOfOccurencesByRadius(id, 2),
      eventRank: await getTypeRankByYear(id, thisYear),
      occurencesOfTypeByYear: await getOccurencesOfTypeByYear(
        event.type,
        thisYear
      ),
    };

    event["statistics"] = statistics;

    return event;
  }

  async function getNumberOfOccurencesByRadius(eventId, radius = 2) {
    const statsData = await db.query(
      `
        SELECT 
            e1.event_id,
            COUNT(*) AS occurrence_count
        FROM 
            events e1
        JOIN 
            events e2 ON e1.event_id = e2.event_id
        WHERE 
            e1.event_id = ? AND
            (6371 * ACOS(
                COS(RADIANS(e1.latitude)) * COS(RADIANS(e2.latitude)) * 
                COS(RADIANS(e2.longitude) - RADIANS(e1.longitude)) + 
                SIN(RADIANS(e1.latitude)) * SIN(RADIANS(e2.latitude))
            )) <= ?
        GROUP BY 
            e1.event_id;

      `,
      [eventId, radius]
    );

    return statsData && parseInt(statsData[0].occurrence_count);
  }

  async function getTypeRankByYear(eventId, year) {
    const statsData = await db.query(
      `
      WITH TypeCounts AS (
        SELECT 
          type, 
          COUNT(*) AS occurrence_count
        FROM 
          events
        WHERE
          YEAR(date) = ?
        GROUP BY 
          type
      ),
      RankedTypes AS (
        SELECT 
          type, 
          occurrence_count,
          RANK() OVER (ORDER BY occurrence_count DESC) AS rank
        FROM 
          TypeCounts
      )
      SELECT 
        rank 
      FROM 
        RankedTypes
      WHERE 
          type = (SELECT type FROM events WHERE event_id = ? LIMIT 1);
      `,
      [year, eventId]
    );

    return statsData && parseInt(statsData[0].rank);
  }

  async function getTypeRankByTypeAndYear(typeId, year) {
    const statsData = await db.query(
      `
      WITH TypeCounts AS (
        SELECT 
          type, 
          COUNT(*) AS occurrence_count
        FROM 
          events
        WHERE
          YEAR(date) = ?
        GROUP BY 
          type
      ),
      RankedTypes AS (
        SELECT 
          type, 
          occurrence_count,
          RANK() OVER (ORDER BY occurrence_count DESC) AS rank
        FROM 
          TypeCounts
      )
      SELECT 
        rank 
      FROM 
        RankedTypes
      WHERE 
          type = ?;
      `,
      [year, typeId]
    );

    return statsData && parseInt(statsData[0].rank);
  }

  async function getTypeRankListByYear(
    year = parseInt(new Date().getFullYear())
  ) {
    const statsData = await db.query(
      `
      WITH TypeCounts AS (
          SELECT 
              type, 
              COUNT(*) AS occurrence_count
          FROM 
              events
          WHERE
              YEAR(date) = ?
          GROUP BY 
              type
      ),
      RankedTypes AS (
          SELECT 
              type, 
              occurrence_count,
              RANK() OVER (ORDER BY occurrence_count DESC) AS rank
          FROM 
              TypeCounts
      )
      SELECT 
          t.title, t.type_id, rt.occurrence_count, rt.rank 
      FROM 
          RankedTypes rt
      JOIN
          types t
      ON
          t.type_id = rt.type
      ORDER BY rt.rank ASC
    `,
      [year]
    );

    return statsData.map((stat) => ({
      title: stat.title,
      type: parseInt(stat.type_id),
      occurrences: parseInt(stat.occurrence_count),
      rank: parseInt(stat.rank),
    }));
  }

  async function getTypeStatistics(typeId, year = new Date().getFullYear()) {
    const monthlyData = await db.query(
      `
      SELECT 
          YEAR(date) AS event_year,
          MONTH(date) AS event_month,
          
          COUNT(*) AS total_events,

          (SELECT city 
          FROM events t2 
          WHERE t2.type = 2 AND YEAR(t2.date) = YEAR(t1.date) AND MONTH(t2.date) = MONTH(t1.date)
          GROUP BY city 
          ORDER BY COUNT(*) DESC 
          LIMIT 1
          ) AS city_with_most_events,
          
          (SELECT COUNT(*) 
          FROM events t3 
          WHERE t3.type = 2 AND t3.city = city_with_most_events AND YEAR(t3.date) = YEAR(t1.date) AND MONTH(t3.date) = MONTH(t1.date)
          ) AS most_events_count,
          
          GROUP_CONCAT(CONCAT(latitude, ',', longitude) SEPARATOR '; ') AS coordinates_list

      FROM 
          events t1

      WHERE 
          t1.type = ?
          AND YEAR(date) = ?

      GROUP BY 
          YEAR(date), 
          MONTH(date)

      ORDER BY 
          YEAR(date), 
          MONTH(date);  
    `,
      [typeId, year]
    );

    const yearlyData = await db.query(
      `
      WITH EventSummary AS (
          SELECT 
              YEAR(date) AS event_year,
              MONTH(date) AS event_month,
              city,
              COUNT(*) AS event_count
          FROM 
              events
          WHERE 
              type = ?
              AND YEAR(date) = ?
              AND DATE(date) <= CURRENT_DATE()
          GROUP BY 
              YEAR(date), MONTH(date), city
      ),

      MonthlySummary AS (
          SELECT 
              event_month,
              SUM(event_count) AS total_monthly_events
          FROM 
              EventSummary
          GROUP BY 
              event_month
      ),

      YearlySummary AS (
          SELECT 
              SUM(event_count) AS total_events,
              (SELECT city 
              FROM EventSummary 
              GROUP BY city 
              ORDER BY SUM(event_count) DESC 
              LIMIT 1) AS city_with_most_events,
              (SELECT event_month 
              FROM MonthlySummary 
              ORDER BY total_monthly_events ASC 
              LIMIT 1) AS calmest_month,
              (SELECT event_month 
              FROM MonthlySummary 
              ORDER BY total_monthly_events DESC 
              LIMIT 1) AS busiest_month
          FROM 
              EventSummary
      )

      SELECT 
          total_events,
          city_with_most_events,
          calmest_month,
          busiest_month
      FROM 
          YearlySummary;  
    `,
      [typeId, year]
    );

    return {
      totalEvents: parseInt(yearlyData[0].total_events),
      cityWithMostEvents: yearlyData[0].city_with_most_events,
      calmestMonthIndex: parseInt(yearlyData[0].calmest_month) - 1,
      busiestMonthIndex: parseInt(yearlyData[0].busiest_month) - 1,
      rank: await getTypeRankByTypeAndYear(typeId, year),
      months: monthlyData.map((month) => ({
        monthIndex: parseInt(month.event_month) - 1,
        totalEvents: parseInt(month.total_events),
        cityWithMostEvents: month.city_with_most_events,
        mostEventsCount: parseInt(month.most_events_count),
        coordinates: month.coordinates_list.split(";").map((coordinate) => {
          const [lat, lon] = coordinate.trim().split(",");
          return {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          };
        }),
      })),
    };
  }

  async function getTypeRankByAllTime(typeId) {
    const statsData = await db.query(
      `
        WITH TypeCounts AS (
            SELECT 
                type,
                COUNT(*) AS occurrence_count
            FROM 
                events
            GROUP BY 
                type
        ),
        RankedTypes AS (
            SELECT 
                type, 
                occurrence_count,
                RANK() OVER (ORDER BY occurrence_count DESC) AS rank
            FROM 
                TypeCounts
        )
        SELECT 
            rank 
        FROM 
            RankedTypes
        WHERE 
            type = ?;
        `,
      [typeId]
    );

    return statsData && parseInt(statsData[0].rank);
  }

  async function getOccurencesOfTypeByYear(typeId, year) {
    const statsData = await db.query(
      "SELECT COUNT(event_id) AS count FROM events WHERE type = ? AND YEAR(date) = ?;",
      [typeId, year, year]
    );

    return statsData && parseInt(statsData[0].count);
  }

  return {
    getAll,
    getTypes,
    listAll,
    getById,
    getNumberOfOccurencesByRadius,
    getTypeRankByYear,
    getTypeRankByAllTime,
    getOccurencesOfTypeByYear,
    getTypeRankListByYear,
    getTypeStatistics,
  };
};
