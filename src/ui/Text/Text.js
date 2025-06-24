import React from "react"

export default function Text({text}) {
    return text && text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))
}