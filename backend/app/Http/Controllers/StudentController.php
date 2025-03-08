<?php
namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return Student::all();
    }

    public function show($id)
    {
        return Student::findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|integer|unique:students,student_id',
            'name' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'email' => 'required|string|email|unique:students,email',
            'phone' => 'nullable|string',
        ]);

        return Student::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
    
        $request->validate([
            'student_id' => 'required|integer|unique:students,student_id,'.$id,
            'name' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'email' => 'required|string|email|unique:students,email,'.$id,
            'phone' => 'nullable|string',
        ]);
    
        $student->update($request->all());
        return $student;
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->noContent();
    }
}