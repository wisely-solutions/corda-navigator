package solutions.wisely.corda.navigator.web.controller



data class ResultPage<T>(
    val pagination: Pagination,
    val items: List<T>
)

data class Pagination (
    val total: Long,
    val page: Int,
    val pageSize: Int
)

data class PageRequest (
    val page: Int,
    val pageSize: Int
)