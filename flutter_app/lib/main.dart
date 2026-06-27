// Exemplo Flutter mínimo: captura imagem e envia para Cloud Function
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

void main() { runApp(MyApp()); }

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext c) {
    return MaterialApp(home: HomePage());
  }
}

class HomePage extends StatefulWidget {
  @override State<StatefulWidget> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final ImagePicker _picker = ImagePicker();
  String? _result;
  bool _loading = false;

  Future<void> _pickAndSend() async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera, maxWidth: 1200);
    if (photo == null) return;
    setState(() { _loading = true; _result = null; });
    final bytes = await photo.readAsBytes();
    final base64Image = base64Encode(bytes);
    final uri = Uri.parse("https://us-central1-YOUR_PROJECT.cloudfunctions.net/analyzeMealImage");
    final resp = await http.post(uri, headers: {"Content-Type":"application/json"}, body: jsonEncode({"image_base64": base64Image, "userContext": {"uid":"demo"}}));
    setState(() { _loading = false; _result = resp.body; });
  }

  @override Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("BulkAI - Demo")),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(children: [
          ElevatedButton.icon(onPressed: _pickAndSend, icon: Icon(Icons.camera_alt), label: Text("Tirar foto e analisar")),
          SizedBox(height: 16),
          _loading ? CircularProgressIndicator() : Expanded(child: SingleChildScrollView(child: Text(_result ?? "Sem resultado")))
        ]),
      ),
    );
  }
}
