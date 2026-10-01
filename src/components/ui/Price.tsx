import { formatMoney } from "@/commerce/pricing";
import type { Money } from "@/commerce/types";

export function Price({ money, className = "", ...rest }: { money: Money; className?: string; "data-info"?: boolean }) {
  return (
    <span className={`tabular-nums ${className}`} data-currency={money.currencyCode} {...rest}>
      {formatMoney(money)}
    </span>
  );
}
