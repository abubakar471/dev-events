import { EventType } from "@/lib/constants"
import Image from "next/image"

const EventCard = ({ id, title, image, date, location, description, audience, time, type }: EventType) => {
    return (
        <div className="">
            <Image src={image} alt={title} width={410} height={410} className="rounded-2xl" />
            <h3 className="text-white mt-4">{title}</h3>
            <p className="text-neutral-300 text-md">
                {description}
            </p>
        </div>
    )
}

export default EventCard