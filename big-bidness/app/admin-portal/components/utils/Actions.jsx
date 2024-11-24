import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react"

function Actions({}){
    return(
        <div className="space-x-2">
            <Button variant="outline" size="icon" className="bg-green-300 ">
                <Check/>
            </Button>
            <Button variant="outline" size="icon" className="bg-red-300 ">
                <X/>
            </Button>
        </div>
    );
}

function XAction({}){
    return(
        <div>
            <Button variant="outline" size="icon" className="bg-red-300 ">
                <X/>
            </Button>
        </div>
    );
}

export {Actions, XAction}
