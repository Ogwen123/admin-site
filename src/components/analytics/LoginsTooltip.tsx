import { lineColours } from "../routes/Analytics";

const LoginsTooltip = ({ active, payload, label, data }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-hr rounded-md w-[300px] flex flex-row">
                <div className="w-1/3">
                    <div style={{ backgroundColor: lineColours.total }} className="h-[10px] rounded-tl-md"></div>
                    <div className="flex flex-col p-[5px]">
                        <div>Total</div>
                        <div>
                            {data.logins[label].total}
                        </div>
                    </div>
                </div>
                <div className="w-1/3">
                    <div style={{ backgroundColor: lineColours.success }} className="h-[10px]"></div>
                    <div className="flex flex-col p-[5px]">
                        <div>Successes</div>
                        <div>
                            {data.logins[label].success}
                        </div>
                    </div>
                </div>
                <div className="w-1/3">
                    <div style={{ backgroundColor: lineColours.fail }} className="h-[10px] rounded-tr-md"></div>
                    <div className="flex flex-col p-[5px]">
                        <div>Fails</div>
                        <div>
                            {data.logins[label].fail}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>

            </div>
        )
    }
};

export default LoginsTooltip  