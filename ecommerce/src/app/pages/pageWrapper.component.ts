import { Match } from 'navigo';
import { About } from 'pages/about/about.component';
import { Catalog } from 'pages/catalog/catalog.component';
import { Category } from 'pages/category/category.component';
import { Footer } from 'pages/footer/footer.component';
import { Header } from 'pages/header/header.components';
import { Login } from 'pages/login/login.component';
import { Main } from 'pages/main/main.component';
import { NotFound } from 'pages/notFound/notFound.component';
import { Product } from 'pages/product/product.component';
import { Profile } from 'pages/profile/profile.component';
import { Signup } from 'pages/signup/signup.component';
import { apiService } from 'services/api.service';
import { routingService } from 'services/routing.service';
import { BaseComponent } from 'shared/base/base.component';
import { loader } from 'shared/loader/loader.component';
import { Slider } from 'shared/slider/slider.component';

import { CartComponent } from './cart/cart.component';
import { PagesPaths } from './pageWrapper.consts';
import {
  initCartCounter,
  isIncorrectCategoryPath,
  isLogined,
  redirectToMain,
} from './pageWrapper.helpers';
import styles from './pageWrapper.module.scss';
import { CategoryParams, ProductParams } from './pageWrapper.types';

export class PageWrapper extends BaseComponent {
  private readonly pageContent;

  private readonly header: Header;

  private readonly notFound: NotFound;

  constructor() {
    super({ className: styles.pageWrapper });

    this.pageContent = new BaseComponent({ tag: 'main', className: styles.pageContent });

    this.header = new Header();

    this.notFound = new NotFound();

    this.appendChildren([this.header, this.pageContent, new Footer()]);

    this.addListener('click', (event) => this.header.closeMobileMenu(event));

    this.initRoutingService();

    initCartCounter();
  }

  private initRoutingService(): void {
    const main = new Main();

    routingService.setHooks({
      before: (done, match) => {
        this.header.updateNavLinks(match.url);
        done();
      },
    });

    routingService.setRouting({
      [PagesPaths.MAIN]: () => this.goToPage(main),
      [PagesPaths.HOME]: () => this.goToPage(main),
      [PagesPaths.LOGIN]: () => this.goToLogin(),
      [PagesPaths.SIGNUP]: () => this.goToSignup(),
      [PagesPaths.CATALOG]: () => this.goToPage(new Catalog()),
      [PagesPaths.ABOUT]: () => this.goToPage(new About()),
      [PagesPaths.CATEGORY]: (match) => this.goToCategory(match),
      [PagesPaths.PRODUCT]: (match) => this.goToProduct(match),
      [PagesPaths.PROFILE]: () => this.goToProfile(),
      [PagesPaths.CART]: () => this.goToPage(new CartComponent()),
    });

    routingService.setNotFound(() => this.goToPage(this.notFound));
  }

  private goToLogin(): void {
    if (isLogined()) {
      redirectToMain();
    } else {
      this.goToPage(new Login());
    }
  }

  private goToSignup(): void {
    if (isLogined()) {
      redirectToMain();
    } else {
      this.goToPage(new Signup());
    }
  }

  private goToCategory({ data }: Match): void {
    if (!data) return;

    const params = data as CategoryParams;

    if (isIncorrectCategoryPath(params.category)) {
      this.goToPage(this.notFound);
    } else {
      this.goToPage(new Category(params.category));
    }
  }

  private goToProduct({ data }: Match): void {
    if (!data) return;

    const params = data as ProductParams;

    if (isIncorrectCategoryPath(params.category)) {
      this.goToPage(this.notFound);
      return;
    }

    loader.open();
    apiService
      .getFilteredProducts({
        filterProps: {
          slug: params.slug,
          colors: [params.color],
        },
      })
      .then((products) => {
        const product = products.body.results;

        if (!product.length) {
          this.goToPage(this.notFound);
        } else {
          this.goToPage(new Product(params.category, product[0]));
          routingService.updateLinks();
          Slider.init();
        }
      })
      .finally(() => loader.close());
  }

  private goToProfile(): void {
    if (isLogined()) {
      this.goToPage(new Profile());
    } else {
      routingService.navigate(PagesPaths.LOGIN);
    }
  }

  private goToPage(page: BaseComponent): void {
    this.pageContent.destroyChildren();
    this.pageContent.append(page);
  }
}
