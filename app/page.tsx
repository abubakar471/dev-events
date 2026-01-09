import EventsContainer from "@/components/landing/events-container/EventsContainer";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-center">Dev Events 2026</h1>
      <p className="text-center mt-5">
        All meetup, hackathon, contents that will be done throughout 2026 will be listed out here for you to participate.
      </p>

      <div className="container mx-auto! my-20">
        <EventsContainer />
      </div>
      
    </div>
  );
}
