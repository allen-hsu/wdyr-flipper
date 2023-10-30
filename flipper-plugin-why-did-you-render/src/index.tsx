import { DataTableColumn, createTablePlugin } from 'flipper-plugin'

type ReportInfo = {
  name: string
  diffType: string
  prev: object
  next: object
  whyRender: string
  pathString: string
}

const columns: DataTableColumn<ReportInfo>[] = [
  {
    key: 'name',
    title: 'Name',
  },
  {
    key: 'whyRender',
    title: 'Why Render',
  },
  {
    key: 'pathString',
    title: "What's Changed",
  },
  {
    key: 'diffType',
    title: 'Diff Type',
  },
]

module.exports = createTablePlugin<ReportInfo>({
  columns,
  method: 'newInfo',
})
