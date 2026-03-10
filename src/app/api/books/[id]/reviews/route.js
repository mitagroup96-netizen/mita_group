import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Book from "@/models/Book";
import { isValidObjectId } from "mongoose";

export async function POST(req, { params }) {
  try {

    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success:false, message:"Invalid book ID" },
        { status:400 }
      );
    }

    const body = await req.json();
    const { name, rating, comment } = body;

    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json(
        { success:false, message:"Book not found" },
        { status:404 }
      );
    }

    // create review
    const review = await Review.create({
      book:id,
      name,
      rating,
      comment
    });

    // recalculate rating
    const reviews = await Review.find({ book:id });

    const totalRatings = reviews.length;

    const avgRating =
      reviews.reduce((acc,item)=> acc + item.rating,0) / totalRatings;

    book.rating = avgRating.toFixed(1);
    book.totalRatings = totalRatings;

    await book.save();

    return NextResponse.json({
      success:true,
      message:"Review added",
      data:review
    });

  } catch(error) {

    if(error.code === 11000){
      return NextResponse.json({
        success:false,
        message:"You already reviewed this book"
      },{status:400})
    }

    return NextResponse.json({
      success:false,
      message:"Server error",
      error:error.message
    },{status:500})
  }
}
export async function GET(req, { params }) {

  try{

    await connectDB();

    const { id } = await params;

    const reviews = await Review
      .find({ book:id })
      .sort({ createdAt:-1 })
      .lean();

    return NextResponse.json({
      success:true,
      count:reviews.length,
      data:reviews
    });

  }catch(error){

    return NextResponse.json({
      success:false,
      message:"Failed to get reviews"
    },{status:500})

  }
}