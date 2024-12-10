import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react"

function Actions({ onApprove, onReject }){
    return(
        <div className="space-x-2 grid grid-cols-2 sm:grid-cols-2 gap-2">
            <Button variant="outline" size="icon" className="bg-white-300" onClick={onApprove} >
                <Check/>
            </Button>
            <Button variant="outline" size="icon" className="bg-red-300" onClick={onReject}>
                <X/>
            </Button>
        </div>
    );
}

function XAction({ onSuspend }){
    return(
        <div>
            <Button variant="outline" size="icon" className="bg-red-300 " onClick={onSuspend}>
                <X/>
            </Button>
        </div>
    );
}

export {Actions, XAction}
