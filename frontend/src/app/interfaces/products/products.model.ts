import { Category } from '../category/category.model';
import { ReviewModel } from '../review/review.model';
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  //   sold:         number,
  quantity: number;
  category: Category; // เพิ่ม category ที่เชื่อมโยงกับ Category interface
  //   orderItems:   ProductOnOrder[],
  //   cartItems:    ProductOnCart[],
  //   images:       Image[],
    createdAt:    Date,
    updatedAt:    Date,
  //   category:     Category?,
  //   categoryId:   Int?,
  //   status:       ProductStatus,
  //   stockRecords: StockRecord[],
  //   bookmarks:    Bookmark[],
    reviews:      ReviewModel[],
}
