import pgpkg from "pg";

const pg = new pgpkg.Pool({
  connectionString: process.env.PG_CONNECTION_STRING
});

export default pg;
export const sql = String.raw;
