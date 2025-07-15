export class Router {
    constructor(DefaultPath, DefaultView, NotFoundView, root , pathsetter) {
        this.root = root
        this.pathsetter = pathsetter
        this.routes = new Map()
        this.DefaultPath = DefaultPath
        this.AddPath(DefaultPath, DefaultView)
        this.AddPath(404, NotFoundView)
        this.ListenTohash()
        this.RenderView(DefaultPath)

    }

    ListenTohash() {

        window.addEventListener("hashchange", (e) => {

            console.log("the hash changed" , this.GetCurrentPath())
            e.preventDefault()
            console.log("paathseer" , this.pathsetter);
            if(this.GetCurrentPath().length > 0) {

              this.pathsetter(this.GetCurrentPath())
                this.RenderView(this.GetCurrentPath())
                
            }

     

        })

    }
    Navigate(Path) {
        location.hash = Path;

    }

    RenderView(Path) {
        console.log(Path, "paaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(this.routes);
        const viewFn = this.routes.get(Path) || this.routes.get(this.DefaultPath);
 

        console.log(viewFn, "thiiiiiiiiis vuewwwwww");

        viewFn.update()
    }

    AddPath(Path, View) {
        this.routes.set(Path, View)
        console.log(this.routes);

    }

    GetCurrentPath() {
        return location.hash
    }
}


// const root = document.getElementById("root")
// console.log(HomeView());
