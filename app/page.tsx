useEffect(() => {
    Analytics.pageView('/')
    Performance.measurePageLoad()
    Performance.trackResources()

    return () => {
      Performance.cleanup()
    }
  }, [])