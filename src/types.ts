export interface InjectedAPI {
	enable: () => Promise<true>;
	isEnabled: () => Promise<boolean>;
	apiVersion: string;
	name: string;
	icon: string;
}
