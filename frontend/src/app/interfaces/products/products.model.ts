import { Category } from '../category/category.model';
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
  //   createdAt:    DateTime,
  //   updatedAt:    DateTime,
  //   category:     Category?,
  //   categoryId:   Int?,
  //   status:       ProductStatus,
  //   stockRecords: StockRecord[],
  //   bookmarks:    Bookmark[],
  //   reviews:      Review[]
}
