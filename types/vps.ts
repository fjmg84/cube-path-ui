export type FloatingIp = {
  address: string;
  netmask: string;
  type: "IPv4" | "IPv6";
  protection_type: string;
  is_primary: boolean;
};

export type VPS = {
  id: number;
  label: string;
  name: string;
  hostname: string;
  status: string;
  user: string;
  plan: {
    plan_name: string;
    ram: number;
    cpu: number;
    storage: number;
    bandwidth: number;
    price_per_hour: number;
  };
  template: {
    template_name: string;
    os_name: string;
  };
  floating_ips: {
    list: FloatingIp[];
    price_per_hour: number;
  };
  ssh_keys: string[];
  location: {
    description: string;
    location_name: string;
  };
  network: null | object;
  firewall_groups: unknown[];
  firewall_enabled: boolean;
  project: {
    id: number;
    name: string;
    description: string;
  };
};
