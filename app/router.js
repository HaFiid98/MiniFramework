    export class Router {
        constructor(DefaultPath, DefaultView, NotFoundView, root ) {
            this.root = root
            this.routes = new Map()
            this.AddPath(DefaultPath, DefaultView)
            this.AddPath(404, NotFoundView)
            this.ListenTohash()
            this.RenderView(this.GetCurrentPath())

        }

        ListenTohash() {
            window.addEventListener("hashchange", () =>
                this.RenderView(this.GetCurrentPath()))
        }
        Navigate(Path) {
            if (location.hash.slice(1) !== Path) {
                location.hash = Path;
            }
        }

        RenderView(Path) {
            console.log(Path);
            console.log(this.routes);
            
            const viewFn = this.routes.get(Path) || this.routes.get(404);
            // console.log("heeelo" ,viewFn);
   
            
            // if (typeof viewFn === "function" ){

            //     this.root.innerHTML = viewFn();
            // }else{
        // }

            this.root.innerHTML = ""
            console.log(viewFn , "thiiiiiiiiis vuewwwwww");
            
            viewFn.render()
        }

        AddPath(Path, View) {
            this.routes.set(Path, View)
        }

        GetCurrentPath() {
            return location.hash.slice(1) || '/';
        }
    }


    function HomeView() {
        return ` <div>Helllo</div>`
    }

    function NotFoundView() {
        return ` <div>404</div>`
    }
    // const root = document.getElementById("root")
    // console.log(HomeView());
