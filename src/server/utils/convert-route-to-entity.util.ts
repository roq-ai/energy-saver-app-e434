const mapping: Record<string, string> = {
  organizations: 'organization',
  'residential-users': 'residential_user',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
