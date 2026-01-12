import { Schema, model, type Document, type Model, type Types } from 'mongoose';
import { Event } from './event.model';

// Shape of data required to create a Booking.
export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

// Full Booking document stored in MongoDB.
export interface BookingDocument extends BookingAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingModel extends Model<BookingDocument> {}

const bookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // index for efficient lookups by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        // Basic email format validation.
        validator(value: string): boolean {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Invalid email address',
      },
    },
  },
  {
    timestamps: true, // auto-manage createdAt/updatedAt
    versionKey: false,
  },
);

// Explicit index on eventId to support common query patterns.
bookingSchema.index({ eventId: 1 });

// Pre-save hook: ensure referenced Event exists.
bookingSchema.pre<BookingDocument>('save', async function preSave(next) {
  try {
    // Verify that the referenced Event exists before saving the booking,
    // but only if the document is new or the eventId has been modified.
    if (this.isNew || this.isModified('eventId')) {
      const eventExists = await Event.exists({ _id: this.eventId });
      if (!eventExists) {
        throw new Error('Invalid eventId: referenced Event does not exist');
      }
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Booking = model<BookingDocument, BookingModel>('Booking', bookingSchema);
