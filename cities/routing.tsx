import React from "react";
import {
  Link as RouterLink,
  useNavigate as useRouterNavigate,
  type LinkProps,
  type NavigateFunction,
} from "react-router-dom";
import { useCity } from "./context";
export * from "react-router-dom";

// Existing site-relative links stay inside the selected city. Outside a city
// provider these behave exactly like React Router (including existing tests).
export function Link({ to, ...props }: LinkProps) {
  const city = useCity();
  const scoped =
    typeof to === "string"
      ? city && to.startsWith("/")
        ? `/${city.slug}${to}`
        : to
      : {
          ...to,
          pathname:
            city && to.pathname?.startsWith("/")
              ? `/${city.slug}${to.pathname}`
              : to.pathname,
        };
  return <RouterLink to={scoped} {...props} />;
}

export function useNavigate(): NavigateFunction {
  const city = useCity();
  const navigate = useRouterNavigate();
  return React.useCallback<NavigateFunction>(
    ((to, options) => {
      if (typeof to === "number") return navigate(to);
      const scoped =
        typeof to === "string"
          ? city && to.startsWith("/")
            ? `/${city.slug}${to}`
            : to
          : {
              ...to,
              pathname:
                city && to.pathname?.startsWith("/")
                  ? `/${city.slug}${to.pathname}`
                  : to.pathname,
            };
      return navigate(scoped, options);
    }) as NavigateFunction,
    [city, navigate],
  );
}
