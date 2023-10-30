import { addPlugin } from 'react-native-flipper'
import { diffTypes } from './consts'
const IDENTIFIER = 'flipper-plugin-why-did-you-render'

export function setupDefaultFlipperReporter(wdyrStore: any) {
  let storedConnection = null // 重新命名為 storedConnection 以避免混淆
  const wdyrStoreInstance = wdyrStore
  const shouldReport = (reason, Component) => {
    if (
      Component.whyDidYouRender &&
      Component.whyDidYouRender.logOnDifferentValues
    ) {
      return true
    }

    const hasDifferentValues =
      (reason.propsDifferences &&
        reason.propsDifferences.some(
          (diff) => diff.diffType === diffTypes.different
        )) ||
      (reason.stateDifferences &&
        reason.stateDifferences.some(
          (diff) => diff.diffType === diffTypes.different
        )) ||
      (reason.hookDifferences &&
        reason.hookDifferences.some(
          (diff) => diff.diffType === diffTypes.different
        ))

    return !hasDifferentValues
  }

  const createDiff = (
    differences,
    name,
    reportInfos,
    prevValue,
    nextValue,
    whyRender,
    hookName = ''
  ) => {
    if (differences && differences.length > 0) {
      for (const diffObj of differences) {
        const { pathString, diffType } = diffObj
        if (diffType === 'hook') {
          reportInfos.push({
            name,
            diffType,
            prev: prevValue[pathString],
            next: nextValue[pathString],
            whyRender,
            pathString,
            hookName,
          })
        } else {
          reportInfos.push({
            name,
            diffType,
            prev: prevValue[pathString],
            next: nextValue[pathString],
            whyRender,
            pathString,
          })
        }
      }
    }
  }
  const createReportInfoList = (info) => {
    const {
      Component,
      displayName,
      hookName,
      prevProps,
      prevState,
      prevHook,
      nextProps,
      nextState,
      nextHook,
      reason,
    } = info

    const name = `[${displayName}] : ${Component.name} `
    const reportInfos = []
    createDiff(
      reason.propsDifferences,
      name,
      reportInfos,
      prevProps,
      nextProps,
      'props changed'
    )

    createDiff(
      reason.hookDifferences,
      name,
      reportInfos,
      prevHook,
      nextHook,
      'hook changed',
      hookName
    )

    createDiff(
      reason.stateDifferences,
      name,
      reportInfos,
      prevState,
      nextState,
      'state changed'
    )

    if (reason.propsDifferences && reason.ownerDifferences) {
      const prevOwnerData = wdyrStoreInstance.ownerDataMap.get(prevProps)
      const nextOwnerData = wdyrStoreInstance.ownerDataMap.get(nextProps)

      const ownerName = `[${nextOwnerData.displayName}] : ${nextOwnerData.Component.name} `

      if (reason.ownerDifferences.propsDifferences) {
        createDiff(
          reason.ownerDifferences.propsDifferences,
          ownerName,
          reportInfos,
          prevOwnerData.props,
          nextOwnerData.props,
          'owner props changed'
        )
      }

      if (reason.ownerDifferences.stateDifferences) {
        createDiff(
          reason.ownerDifferences.stateDifferences,
          ownerName,
          reportInfos,
          prevOwnerData.state,
          nextOwnerData.state,
          'owner state changed'
        )
      }

      if (reason.ownerDifferences.hookDifferences) {
        reason.ownerDifferences.hookDifferences.forEach(
          ({ hookName, differences }, i) =>
            createDiff(
              differences,
              ownerName,
              reportInfos,
              prevOwnerData.hooks[i].result,
              nextOwnerData.hooks[i].result,
              'owner hook changed',
              hookName
            )
        )
      }
    }

    return reportInfos
  }

  const addUpdateInfo = (info) => {
    if (storedConnection !== null) {
      if (!shouldReport(info.reason, info.Component)) {
        return
      }

      const reportInfos = createReportInfoList(info)

      for (const reportInfo of reportInfos) {
        // console.log('reportInfo', reportInfo)
        storedConnection.send('newInfo', reportInfo)
      }
    }
  }

  addPlugin({
    getId() {
      return IDENTIFIER
    },
    onConnect(connection) {
      storedConnection = connection
    },
    onDisconnect() {
      storedConnection = null
    },
  })

  return {
    addUpdateInfo: addUpdateInfo,
  }
}
