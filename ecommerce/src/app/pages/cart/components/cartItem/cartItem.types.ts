export type CartItemProps = {
  id: string;
  imageSrc: string;
  name: string;
  quantity: string;
  originPricePerOne: number;
  promoPricePerOne: number | undefined;
  subtotal: number;
};
