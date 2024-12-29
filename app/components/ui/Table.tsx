import { cn } from '@/app/lib/utils'
import { tableStyles } from '@/app/styles/components'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <div className="overflow-x-auto">
        <table
          className={cn(tableStyles.table, className)}
          {...props}
        />
      </div>
    </div>
  )
}

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

Table.Head = function TableHead({ className, ...props }: TableHeadProps) {
  return <thead className={cn(tableStyles.thead, className)} {...props} />
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

Table.Body = function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn(tableStyles.tbody, className)} {...props} />
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

Table.Row = function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={className} {...props} />
}

interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {}

Table.Header = function TableHeader({ className, ...props }: TableHeaderProps) {
  return <th className={cn(tableStyles.th, className)} {...props} />
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {}

Table.Cell = function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn(tableStyles.td, className)} {...props} />
}