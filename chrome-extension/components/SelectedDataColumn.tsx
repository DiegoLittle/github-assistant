import React, { FC } from "react"

type Props = {
  className?: string
  columnLabel: string
  data: any[]
  table: Record<string, any>
  setTable: any
} & React.HTMLAttributes<HTMLDivElement>

const SelectedDataColumn: FC<Props> = ({
  className,
  columnLabel,
  data,
  table,
  setTable,
  ...props
}: Props): JSX.Element => {
  const [hovering, setHovering] = React.useState(false)
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}>
        <div
          style={{
            marginRight: 20,
            position: "relative"
          }}
          className={`flex relative group flex-col`}>
          {columnLabel}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}>
          <button
            onClick={() => {
              const newTable = { ...table }
              delete newTable[columnLabel]
              setTable(newTable)
            }}
            className={`hidden group-hover:block absolute top-0 right-0 bg-white border border-gray-300 rounded-md shadow-md p-2`}
            //   Convert to style
            style={{
              cursor: "pointer",
              display: hovering ? "block" : "none",
              // position: "absolute",
              // right: -13,
              // top: -2,
              backgroundColor: "black",
              // border: "1px solid #333",
              borderRadius: 4
              // padding: 6,
              // boxShadow: "0 0 4px rgba(0,0,0,0.2)",
            }}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"></path>
            </svg>
          </button>
          <button
            onClick={() => {
            //   Copy to clipboard
                navigator.clipboard.writeText(JSON.stringify(data))
            }}
            className={`hidden group-hover:block absolute top-0 right-0 bg-white border border-gray-300 rounded-md shadow-md p-2`}
            //   Convert to style
            style={{
              cursor: "pointer",
              display: hovering ? "block" : "none",
              // position: "absolute",
              // right: -13,
              // top: -2,
              backgroundColor: "black",
              // border: "1px solid #333",
              borderRadius: 4
              // padding: 6,
              // boxShadow: "0 0 4px rgba(0,0,0,0.2)",
            }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H7V13H3.5C3.22386 13 3 12.7761 3 12.5V2.5C3 2.22386 3.22386 2 3.5 2H4V2.25C4 2.66421 4.33579 3 4.75 3H10.25C10.6642 3 11 2.66421 11 2.25V2H11.5C11.7761 2 12 2.22386 12 2.5V7H13V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM9 8.5C9 8.77614 8.77614 9 8.5 9C8.22386 9 8 8.77614 8 8.5C8 8.22386 8.22386 8 8.5 8C8.77614 8 9 8.22386 9 8.5ZM10.5 9C10.7761 9 11 8.77614 11 8.5C11 8.22386 10.7761 8 10.5 8C10.2239 8 10 8.22386 10 8.5C10 8.77614 10.2239 9 10.5 9ZM13 8.5C13 8.77614 12.7761 9 12.5 9C12.2239 9 12 8.77614 12 8.5C12 8.22386 12.2239 8 12.5 8C12.7761 8 13 8.22386 13 8.5ZM14.5 9C14.7761 9 15 8.77614 15 8.5C15 8.22386 14.7761 8 14.5 8C14.2239 8 14 8.22386 14 8.5C14 8.77614 14.2239 9 14.5 9ZM15 10.5C15 10.7761 14.7761 11 14.5 11C14.2239 11 14 10.7761 14 10.5C14 10.2239 14.2239 10 14.5 10C14.7761 10 15 10.2239 15 10.5ZM14.5 13C14.7761 13 15 12.7761 15 12.5C15 12.2239 14.7761 12 14.5 12C14.2239 12 14 12.2239 14 12.5C14 12.7761 14.2239 13 14.5 13ZM14.5 15C14.7761 15 15 14.7761 15 14.5C15 14.2239 14.7761 14 14.5 14C14.2239 14 14 14.2239 14 14.5C14 14.7761 14.2239 15 14.5 15ZM8.5 11C8.77614 11 9 10.7761 9 10.5C9 10.2239 8.77614 10 8.5 10C8.22386 10 8 10.2239 8 10.5C8 10.7761 8.22386 11 8.5 11ZM9 12.5C9 12.7761 8.77614 13 8.5 13C8.22386 13 8 12.7761 8 12.5C8 12.2239 8.22386 12 8.5 12C8.77614 12 9 12.2239 9 12.5ZM8.5 15C8.77614 15 9 14.7761 9 14.5C9 14.2239 8.77614 14 8.5 14C8.22386 14 8 14.2239 8 14.5C8 14.7761 8.22386 15 8.5 15ZM11 14.5C11 14.7761 10.7761 15 10.5 15C10.2239 15 10 14.7761 10 14.5C10 14.2239 10.2239 14 10.5 14C10.7761 14 11 14.2239 11 14.5ZM12.5 15C12.7761 15 13 14.7761 13 14.5C13 14.2239 12.7761 14 12.5 14C12.2239 14 12 14.2239 12 14.5C12 14.7761 12.2239 15 12.5 15Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default SelectedDataColumn


const icon_classes = ["Typography","Music","Abstract","Logos","Arrows","Objects","Design","Components","Borders and corners","Alignment"]