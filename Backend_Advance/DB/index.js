import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";

const connectDB = async () => {
  try {
    const connecttionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(`\n MONGODB connected ${connecttionInstance.connection.host}`);
  } catch (error) {
    console.log("DB connection Error: ", error.message);
    process.exit(1);
  }
};

export default connectDB;

// Second Method connect DB
/*import mongoose from "mongoose";
import { DB_NAME } from "./constants";

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    app.on("error", (err) => {
      console.log("ERROR", err);
    });

    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("DB Connection Error :", error.message);
  }
})();
*/
