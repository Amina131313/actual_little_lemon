/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/screens/Home`; params?: Router.UnknownInputParams; } | { pathname: `/screens/Onboarding`; params?: Router.UnknownInputParams; } | { pathname: `/screens/Profile2`; params?: Router.UnknownInputParams; } | { pathname: `/screens/ProfileImage`; params?: Router.UnknownInputParams; } | { pathname: `/screens/something2`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/Home`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/Onboarding`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/Profile2`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/ProfileImage`; params?: Router.UnknownOutputParams; } | { pathname: `/screens/something2`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/screens/Home${`?${string}` | `#${string}` | ''}` | `/screens/Onboarding${`?${string}` | `#${string}` | ''}` | `/screens/Profile2${`?${string}` | `#${string}` | ''}` | `/screens/ProfileImage${`?${string}` | `#${string}` | ''}` | `/screens/something2${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/screens/Home`; params?: Router.UnknownInputParams; } | { pathname: `/screens/Onboarding`; params?: Router.UnknownInputParams; } | { pathname: `/screens/Profile2`; params?: Router.UnknownInputParams; } | { pathname: `/screens/ProfileImage`; params?: Router.UnknownInputParams; } | { pathname: `/screens/something2`; params?: Router.UnknownInputParams; };
    }
  }
}
