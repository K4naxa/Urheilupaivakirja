import { PiHockey } from "react-icons/pi";
import { IoIosFootball } from "react-icons/io";
import { CiFootball } from "react-icons/ci";

export default function getSportIcon(sport) {
  switch (sport) {
    case "jäkiekko":
      return <PiHockey />;
    case "jalkapallo":
      return <IoIosFootball />;
    case "amerikkalainen-jalkapallo":
      return <CiFootball />;

    default:
      break;
  }
}
