export const enum ProductsCategories {
  CHAIRS = 'chairs',
  SOFAS = 'sofas',
  BEDS = 'beds',
}

export enum ProductsBrands {
  COLAMY = 'COLAMY',
  FEONASE = 'Feonase',
  MELLOW = 'Mellow',
  NOVILLA = 'Novilla',
  POLYBARK = 'POLY & BARK',
  SHINTENCHI = 'Shintenchi',
  VECELO = 'VECELO',
  ZINUS = 'ZINUS',
  ANJHOME = 'ANJHOME',
}

export enum ProductsColors {
  BLACK = 'black',
  GREY = 'grey',
  WHITE = 'white',
  BROWN = 'brown',
  BEIGE = 'beige',
  RED = 'red',
  PINK = 'pink',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  IVORY = 'ivory',
  GREEN = 'green',
  BLUE = 'blue',
  PURPLE = 'purple',
  GOLD = 'gold',
  SILVER = 'silver',
}

export const enum ProductsAttributes {
  BRAND = 'brand',
  COLOR = 'color',
}

export enum Addresses {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

export const PRODUCTS_CATEGORIES_IDS = {
  [ProductsCategories.CHAIRS]: 'aaf8c963-3c9a-4208-bef3-79c2560468f5',
  [ProductsCategories.SOFAS]: '152e9396-eaca-4ee2-bc32-2b37ab2ea8c8',
  [ProductsCategories.BEDS]: '03933605-debc-43c0-86e9-ef19d49062b8',
} as const satisfies Record<ProductsCategories, string>;

export const PRODUCTS_COUNT_ON_PAGE = 4;
