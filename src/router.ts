type Route = {
    path: string;
    view: (context: Context) => void;
    regex: RegExp;
};

type paramMap = Map<string, string>;
type navigator = (path: string) => void;

export class Context {
    paramMap: paramMap;
    navigate: navigator;

    constructor(paramMap: paramMap, navigate: navigator) {
        this.paramMap = paramMap;
        this.navigate = navigate;
    }

    param(param: string): string | undefined {
        return this.paramMap.get(param);
    }
}

export function newRouter() {
    return new Router();
}

export class Router {
    routes: Route[] = [];
    notFoundView: () => void = () => {
        console.error("404");
    };

    add(path: string, view: (context: Context) => void) {
        const regex = new RegExp(
            "^" + path.replace(/\//g, "/").replace(/:\w+/g, "(.+)") + "$",
        );
        this.routes.push({ path, view, regex });
    }

    async updateView() {
        const path = location.pathname;
        for (let i = 0; i < this.routes.length; i++) {
            const route = this.routes[i];
            if (route.regex.test(path)) {
                const values = path.match(route.regex)!.splice(1);
                const keys = Array.from(route.path.matchAll(/:(\w+)/g)).map(
                    (result) => result[1],
                );

                const params = new Map(
                    keys.map((k, i) => {
                        return [k, values[i]];
                    }),
                );

                this.routes[i].view(
                    new Context(params, this.navigate.bind(this)),
                );
                return;
            }
        }

        this.notFoundView();
    }

    navigate(path: string) {
        if (path === location.pathname) {
            return;
        }
        history.pushState(null, "", path);
        this.updateView();
    }

    start() {
        window.addEventListener("popstate", this.updateView.bind(this));
        this.updateView();
    }
}
