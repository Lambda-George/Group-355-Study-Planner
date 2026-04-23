;(function () {
  const dataEl = document.getElementById('ue-events-data')
  if (!dataEl) return

  let allEvents = []
  try {
    allEvents = JSON.parse(dataEl.textContent || '[]')
  } catch {
    allEvents = []
  }

  const els = {
    list: document.getElementById('ueList'),
    listEmpty: document.getElementById('ueListEmpty'),
    searchInput: document.getElementById('ueSearchInput'),
    detailTitle: document.getElementById('ueDetailTitle'),
    detailMeta: document.getElementById('ueDetailMeta'),
    detailInfo: document.getElementById('ueDetailInfo'),
    moreBtn: document.getElementById('ueMoreBtn'),
    popup: document.getElementById('uePopup'),
    popupDragHandle: document.getElementById('uePopupDragHandle'),
    popupClose: document.getElementById('uePopupClose'),
    popupTitlebarText: document.getElementById('uePopupTitlebarText'),
    popupTitle: document.getElementById('uePopupTitle'),
    popupMeta: document.getElementById('uePopupMeta'),
    popupInfo: document.getElementById('uePopupInfo'),
    popupAdditional: document.getElementById('uePopupAdditional')
  }

  const fmt = {
    mon: (isoDate) => {
      const d = new Date(isoDate + 'T00:00:00')
      return d.toLocaleString(undefined, { month: 'short' })
    },
    day: (isoDate) => {
      const d = new Date(isoDate + 'T00:00:00')
      return String(d.getDate())
    }
  }

  let selectedId = null
  let searchQuery = ''

  function eventMatches(evt, q) {
    if (!q) return true
    const hay = [
      evt.title,
      evt.module,
      evt.type,
      evt.date,
      evt.time,
      evt.info,
      evt.additional || ''
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  }

  function getFilteredEvents() {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return allEvents
    return allEvents.filter((e) => eventMatches(e, q))
  }

  function metaHtml(evt) {
    return (
      '<div><strong>' +
      evt.type +
      ' Name</strong></div>' +
      '<div>' +
      evt.module +
      '</div>' +
      '<div>' +
      evt.date +
      '</div>' +
      '<div>' +
      evt.time +
      '</div>'
    )
  }

  function renderList() {
    const visible = getFilteredEvents()
    if (!els.list) return

    els.list.innerHTML = ''

    if (els.listEmpty) {
      els.listEmpty.hidden = visible.length > 0
    }

    if (visible.length === 0) {
      if (els.detailTitle) els.detailTitle.textContent = 'No results'
      if (els.detailMeta) els.detailMeta.innerHTML = ''
      if (els.detailInfo) {
        els.detailInfo.textContent =
          'Try a different search, or clear the search box to see all events.'
      }
      if (els.moreBtn) els.moreBtn.disabled = true
      return
    }

    visible.forEach((evt) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'ue-item'
      btn.setAttribute('role', 'listitem')
      btn.setAttribute('aria-selected', String(evt.id === selectedId))
      btn.addEventListener('click', () => selectEvent(evt.id))

      btn.innerHTML =
        '<div class="ue-date" aria-hidden="true">' +
        '<div class="ue-date-day">' +
        fmt.day(evt.date) +
        '</div>' +
        '<div class="ue-date-mon">' +
        fmt.mon(evt.date) +
        '</div>' +
        '</div>' +
        '<div>' +
        '<div class="ue-item-title">' +
        evt.title +
        '</div>' +
        '<div class="ue-item-lines">' +
        '<div class="ue-line"></div>' +
        '<div class="ue-line" style="width:85%"></div>' +
        '</div>' +
        '</div>'

      els.list.appendChild(btn)
    })
  }

  function closePopup() {
    if (!els.popup) return
    els.popup.setAttribute('hidden', '')
  }

  function fillPopup(evt) {
    if (els.popupTitle) els.popupTitle.textContent = evt.title
    if (els.popupTitlebarText) els.popupTitlebarText.textContent = evt.title
    if (els.popupMeta) els.popupMeta.innerHTML = metaHtml(evt)
    if (els.popupInfo) els.popupInfo.textContent = evt.info
    if (els.popupAdditional) els.popupAdditional.textContent = evt.additional || ''
  }

  function openMore() {
    const visible = getFilteredEvents()
    const evt = visible.find((e) => e.id === selectedId)
    if (!evt) return
    fillPopup(evt)
    if (els.popup) els.popup.removeAttribute('hidden')
  }

  function selectEvent(id) {
    selectedId = id
    const visible = getFilteredEvents()
    const evt = visible.find((e) => e.id === id)
    if (!evt) return

    if (els.detailTitle) els.detailTitle.textContent = evt.title
    if (els.detailMeta) els.detailMeta.innerHTML = metaHtml(evt)
    if (els.detailInfo) els.detailInfo.textContent = evt.info
    if (els.moreBtn) els.moreBtn.disabled = false

    renderList()
  }

  function onSearchInput() {
    searchQuery = els.searchInput ? els.searchInput.value : ''
    const visible = getFilteredEvents()

    if (visible.length === 0) {
      selectedId = null
      renderList()
      return
    }

    if (!visible.some((e) => e.id === selectedId)) {
      selectedId = visible[0].id
    }

    renderList()
    selectEvent(selectedId)
  }

  function setupDraggablePopup(popup, handle) {
    if (!popup || !handle) return

    let dragging = false
    let startX = 0
    let startY = 0
    let originLeft = 0
    let originTop = 0

    function clampToViewport() {
      const margin = 8
      const rect = popup.getBoundingClientRect()
      let left = rect.left
      let top = rect.top
      const maxLeft = window.innerWidth - popup.offsetWidth - margin
      const maxTop = window.innerHeight - popup.offsetHeight - margin
      left = Math.min(Math.max(margin, left), maxLeft)
      top = Math.min(Math.max(margin, top), maxTop)
      popup.style.left = `${left}px`
      popup.style.top = `${top}px`
    }

    function onPointerDown(e) {
      if (e.target.closest && e.target.closest('.ue-popup__close')) return
      if (e.button !== 0) return
      e.preventDefault()

      const rect = popup.getBoundingClientRect()
      popup.style.left = `${rect.left}px`
      popup.style.top = `${rect.top}px`
      popup.style.right = 'auto'
      popup.style.bottom = 'auto'
      popup.style.transform = 'none'

      originLeft = rect.left
      originTop = rect.top
      startX = e.clientX
      startY = e.clientY
      dragging = true

      document.addEventListener('mousemove', onPointerMove)
      document.addEventListener('mouseup', onPointerUp)
    }

    function onPointerMove(e) {
      if (!dragging) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      let left = originLeft + dx
      let top = originTop + dy
      const margin = 8
      const maxLeft = window.innerWidth - popup.offsetWidth - margin
      const maxTop = window.innerHeight - popup.offsetHeight - margin
      left = Math.min(Math.max(margin, left), maxLeft)
      top = Math.min(Math.max(margin, top), maxTop)
      popup.style.left = `${left}px`
      popup.style.top = `${top}px`
    }

    function onPointerUp() {
      if (!dragging) return
      dragging = false
      document.removeEventListener('mousemove', onPointerMove)
      document.removeEventListener('mouseup', onPointerUp)
    }

    handle.addEventListener('mousedown', onPointerDown)
    window.addEventListener('resize', () => {
      if (!popup.hasAttribute('hidden')) clampToViewport()
    })
  }

  if (els.moreBtn) els.moreBtn.addEventListener('click', openMore)
  if (els.popupClose) els.popupClose.addEventListener('click', closePopup)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup()
  })
  if (els.searchInput) {
    els.searchInput.addEventListener('input', onSearchInput)
  }

  setupDraggablePopup(els.popup, els.popupDragHandle)

  const first = getFilteredEvents()[0]
  if (first) selectEvent(first.id)
  else renderList()
})()
