import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LeadManager } from "./lib/lead-manager";
import { currentProduct } from "./lib/utils";

export const RouteChangeHandler = () => {
    const location = useLocation();

    let user = localStorage.getItem("user");

    if (user) user = JSON.parse(user);

    let product = currentProduct();

    useEffect(() => {
        console.log(user);

        if (!user?.isLead) return;
        
        LeadManager.recordActivity({
            action: `Visited ${location.pathname}`,
            path: location.pathname,
            page: location.pathname,
            product: product,
            timestamp: new Date().toISOString(),
        });
    }, [location.pathname]);

    return null;
};
