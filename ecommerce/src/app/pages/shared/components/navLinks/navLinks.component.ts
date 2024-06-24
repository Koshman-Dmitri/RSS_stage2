import { Anchor } from 'globalTypes/elements.type';
import { PagesPaths } from 'pages/pageWrapper.consts';
import { getNavLink } from 'pages/pageWrapper.helpers';

export const signupNavLink = (className: string): Anchor =>
  getNavLink('Signup', PagesPaths.SIGNUP, className);
export const loginNavLink = (className: string): Anchor =>
  getNavLink('Login', PagesPaths.LOGIN, className);
export const catalogNavLink = (className: string): Anchor =>
  getNavLink('Catalog', PagesPaths.CATALOG, className);
export const aboutNavLink = (className: string): Anchor =>
  getNavLink('About', PagesPaths.ABOUT, className);
export const profileNavLink = (className: string): Anchor =>
  getNavLink('', PagesPaths.PROFILE, className);
export const cartNavLink = (className: string): Anchor =>
  getNavLink('', PagesPaths.CART, className);
