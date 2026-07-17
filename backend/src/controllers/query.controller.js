import Query from '../models/Query.model.js';

//   Create a new query
// POST /api/queries
export const createQuery = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    
    const query = await Query.create({
      title,
      description,
      category,
      priority: priority || 'Medium', // Fallback to Medium if not provided
      createdBy: req.user._id,
    });
    
    res.status(201).json(query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Get all queries (with pagination, search, and filters)
//   GET /api/queries
export const getQueries = async (req, res) => {
  try {
    const { search, status, priority, category, page = 1, limit = 10 } = req.query;
    
    // Base filter: NEVER return soft-deleted queries
    const filter = { isDeleted: false };

    // Role-based data isolation: Customers only see their own queries
    if (req.user.role === 'Customer') {
      filter.createdBy = req.user._id;
    }

    // Apply specific filters if they exist in the query string
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // Apply search filter (Title)
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // Case-insensitive
    }

    // Pagination math
    const skip = (page - 1) * limit;

    const queries = await Query.find(filter)
      .populate('createdBy', 'name email') // Joins the user data
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Newest first

    const total = await Query.countDocuments(filter);

    res.json({
      queries,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single query by ID
//   GET /api/queries/:id
export const getQueryById = async (req, res) => {
  try {
    const query = await Query.findOne({ _id: req.params.id, isDeleted: false })
      .populate('createdBy', 'name email');

    if (!query) return res.status(404).json({ message: 'Query not found' });

    // Ensure Customers can't fetch other people's queries by guessing the ID
    if (req.user.role === 'Customer' && query.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this query' });
    }

    res.json(query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Update a query (Description, Status, Category, or Priority)
//   PUT /api/queries/:id
export const updateQuery = async (req, res) => {
  try {
    const query = await Query.findOne({ _id: req.params.id, isDeleted: false });
    if (!query) return res.status(404).json({ message: 'Query not found' });

    // Role-based update logic
    if (req.user.role === 'Customer') {
      // Customers can only update their own queries
      if (query.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this query' });
      }
      // Customers can only edit if the query hasn't been picked up yet
      if (query.status !== 'Open') {
        return res.status(400).json({ message: 'Cannot edit a query that is already in progress or resolved' });
      }
      
      // Customers can update these specific fields
      query.title = req.body.title || query.title;
      query.description = req.body.description || query.description;
      query.category = req.body.category || query.category;
      query.priority = req.body.priority || query.priority;

    } else {
      // Support Agents and Admins can update the operational fields
      query.status = req.body.status || query.status;
      query.priority = req.body.priority || query.priority;
      query.category = req.body.category || query.category;
    }

    const updatedQuery = await query.save();
    res.json(updatedQuery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Soft delete a query
//   PATCH /api/queries/:id/delete
export const deleteQuery = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });

    // Check ownership for Customers
    if (req.user.role === 'Customer' && query.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this query' });
    }

    // Toggle the soft delete flag
    query.isDeleted = true;
    await query.save();

    res.json({ message: 'Query removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};